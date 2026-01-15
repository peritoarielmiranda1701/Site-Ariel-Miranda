import React, { useState } from 'react';
import { directus } from '../../lib/directus';
import { createCollection, createField, updateCollection, createItem, readSingleton, readItems } from '@directus/sdk';
import { CheckCircle, AlertCircle, Loader2, Database } from 'lucide-react';

export const SetupMessages = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) => setLog(prev => [...prev, `> ${msg}`]);

    const runSetup = async () => {
        setStatus('loading');
        setLog([]);
        try {
            addLog("Iniciando setup da coleção 'messages'...");

            // 1. Create Collection
            try {
                // @ts-ignore
                await directus.request(createCollection({
                    collection: 'messages',
                    schema: {},
                    meta: {
                        hidden: false,
                        icon: 'mail',
                        display_template: '{{subject}}',
                        singleton: false,
                        translations: [
                            { language: 'pt-BR', translation: 'Mensagens do Site' }
                        ]
                    }
                }));
                addLog("Coleção 'messages' criada.");
            } catch (e: any) {
                // Check for "already exists" in various formats (code or message)
                if (
                    e?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE' ||
                    e?.message?.includes('already exists') ||
                    JSON.stringify(e).includes('already exists')
                ) {
                    addLog("Coleção 'messages' já existe. Continuando...");
                } else {
                    addLog(`⚠️ Erro ao criar coleção (pode já existir): ${e.message}`);
                }
            }

            // 2. Create Fields
            const fields = [
                { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Novo', value: 'new' }, { text: 'Lido', value: 'read' }] }, width: 'half' }, schema: { default_value: 'new' } },
                { field: 'name', type: 'string', meta: { interface: 'input', width: 'half' } },
                { field: 'email', type: 'string', meta: { interface: 'input', width: 'half' } },
                { field: 'phone', type: 'string', meta: { interface: 'input', width: 'half' } },
                { field: 'subject', type: 'string', meta: { interface: 'input', width: 'full' } },
                { field: 'message', type: 'text', meta: { interface: 'input-multiline', width: 'full' } },
            ];

            for (const f of fields) {
                try {
                    // @ts-ignore
                    await directus.request(createField('messages', f));
                    addLog(`Campo '${f.field}' criado.`);
                } catch (e: any) {
                    // Ignore field exists errors silently or log info
                    if (JSON.stringify(e).includes('already exists') || e?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
                        // Field exists, move on
                    } else {
                        console.warn(`Erro ao criar campo ${f.field}:`, e);
                    }
                }
            }

            // 3. Public Permissions
            addLog("⚠️ IMPORTANTE: O script não pode alterar permissões de sistema. Certifique-se de que a função 'Public' tem permissão de CRIAÇÃO em 'messages'.");

            // 4. Create Email Automation Flow
            addLog("Configurando automação de e-mail...");

            try {
                // Get Target Email
                // @ts-ignore
                const info = await directus.request(readSingleton('Informacoes_Gerais')).catch(() => null);
                // @ts-ignore
                const targetEmail = info?.contact_email || info?.email || 'contato@peritoarielmiranda.com.br';
                addLog(`Email de destino configurado para: ${targetEmail}`);

                // Create Flow (Idempotent)
                let flowId = null;

                try {
                    // Check if exists
                    // @ts-ignore
                    const existingFlows: any = await directus.request(readItems('directus_flows', {
                        filter: { name: { _eq: 'Notificar Contato do Site' } }
                    }));

                    if (existingFlows && existingFlows.length > 0) {
                        flowId = existingFlows[0].id;
                        addLog("Fluxo de automação já existe. Usando ID: " + flowId);
                    } else {
                        // Create
                        // @ts-ignore
                        const newFlow: any = await directus.request(createItem('directus_flows', {
                            name: 'Notificar Contato do Site',
                            icon: 'forward_to_inbox',
                            color: '#D4AF37',
                            status: 'active',
                            trigger: 'action',
                            accountability: 'all',
                            options: {
                                collection: 'messages',
                                event: 'create',
                            }
                        }));
                        flowId = newFlow.id;
                        addLog("Fluxo de automação criado.");
                    }
                } catch (e: any) {
                    addLog(`Erro ao gerenciar Fluxo: ${e.message}`);
                }

                if (flowId) {
                    // Create Mail Operation (Idempotent-ish: check key)
                    // We can't easily check operations inside flow via simple SDK call without knowing structure perfectly, 
                    // but we can try to create and catch "unique" error if key is unique, or just append.
                    // Operation keys must be unique within a flow? Usually yes.

                    try {
                        // @ts-ignore
                        await directus.request(createItem('directus_operations', {
                            flow: flowId,
                            key: 'send_notification_email',
                            name: 'Enviar Email',
                            type: 'mail',
                            position_x: 19,
                            position_y: 1,
                            options: {
                                to: targetEmail,
                                subject: "Novo Contato pelo Site: {{name}}",
                                type: "wysiwyg",
                                body: `
                                <div style="font-family: sans-serif; color: #020617; padding: 20px;">
                                    <h2 style="color: #D4AF37; margin-bottom: 20px;">Novo Contato Recebido</h2>
                                    <p><strong>Nome:</strong> {{name}}</p>
                                    <p><strong>Email:</strong> {{email}}</p>
                                    <p><strong>Telefone:</strong> {{phone}}</p>
                                    <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #D4AF37; margin: 20px 0;">
                                        <strong>Mensagem:</strong><br/>
                                        {{message}}
                                    </div>
                                    <p style="font-size: 12px; color: #64748b;">Este email foi enviado automaticamente pelo sistema do site.</p>
                                </div>
                                `
                            }
                        }));
                        addLog("Operação de envio de email configurada com sucesso!");
                    } catch (opError: any) {
                        // If fails, likely key collision if it already exists.
                        if (opError?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE' || JSON.stringify(opError).includes('unique')) {
                            addLog("Operação de email já existe no fluxo.");
                        } else {
                            addLog(`Erro ao criar operação de email: ${opError.message}`);
                        }
                    }
                }
            } catch (flowError: any) {
                addLog(`Erro na configuração do email: ${flowError.message}`);
            }

            setStatus('success');
        } catch (e: any) {
            console.error(e);
            addLog(`❌ Erro Fatal (Geral): ${e.message}`);
            setStatus('error');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-navy-900 rounded-lg text-gold-500">
                        <Database size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-navy-900">Configuração de Mensagens</h1>
                        <p className="text-slate-500">Cria a tabela no banco de dados para receber contatos.</p>
                    </div>
                </div>

                <div className="bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm mb-6 h-64 overflow-y-auto border border-slate-800 shadow-inner">
                    {log.length === 0 ? <span className="text-slate-600 opacity-50">Log de execução...</span> : log.map((l, i) => <div key={i}>{l}</div>)}
                </div>

                <button
                    onClick={runSetup}
                    disabled={status === 'loading'}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${status === 'loading' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-gold-500 hover:bg-gold-600 text-navy-900 shadow-lg shadow-gold-500/20'}`}
                >
                    {status === 'loading' ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Processando...</span> : 'Executar Configuração'}
                </button>

                {status === 'success' && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-100 text-green-800 rounded-xl flex items-center gap-3">
                        <CheckCircle className="shrink-0" />
                        <div>
                            <strong>Sucesso!</strong> A coleção foi criada. Agora acesse o Directus para liberar a permissão Pública de Criação.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
