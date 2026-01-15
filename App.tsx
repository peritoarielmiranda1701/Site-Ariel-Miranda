import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import { AuthProvider } from './context/AuthContext';

import CollectionLoader from './components/admin/CollectionLoader';
import ItemEditor from './components/admin/ItemEditor';
import SingletonEditor from './components/admin/SingletonEditor';
import {
  ServiceColumns, ServiceFields,
  TestimonialColumns, TestimonialFields,
  FAQColumns, FAQFields,
  InfoFields, HeroFields, SeoFields, AboutFields,
  ProcessoColumns, ProcessoFields
} from './components/admin/AdminConfigs';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Auth Route */}
          <Route path="/painel/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/painel" element={<AdminLayout />}>
            <Route index element={<Navigate to="/painel/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Services */}
            <Route path="servicos" element={
              <CollectionLoader
                collection="services"
                title="Serviços"
                singularName="Serviço"
                columns={ServiceColumns}
                routePath="servicos"
              />
            } />
            <Route path="servicos/:id" element={
              <ItemEditor
                collection="services"
                title="Serviço"
                fields={ServiceFields}
                routePath="servicos"
              />
            } />

            {/* Testimonials */}
            <Route path="depoimentos" element={
              <CollectionLoader
                collection="testimonials"
                title="Depoimentos"
                singularName="Depoimento"
                columns={TestimonialColumns}
                routePath="depoimentos"
              />
            } />
            <Route path="depoimentos/:id" element={
              <ItemEditor
                collection="testimonials"
                title="Depoimento"
                fields={TestimonialFields}
                routePath="depoimentos"
              />
            } />

            {/* FAQs */}
            <Route path="faqs" element={
              <CollectionLoader
                collection="faqs"
                title="Perguntas Frequentes"
                singularName="Pergunta"
                columns={FAQColumns}
                routePath="faqs"
              />
            } />
            <Route path="faqs/:id" element={
              <ItemEditor
                collection="faqs"
                title="Pergunta"
                fields={FAQFields}
                routePath="faqs"
              />
            } />

            {/* Processos */}
            <Route path="processo" element={
              <CollectionLoader
                collection="processos"
                title="Processos"
                singularName="Processo"
                columns={ProcessoColumns}
                routePath="processo"
              />
            } />
            <Route path="processo/:id" element={
              <ItemEditor
                collection="processos"
                title="Processo"
                fields={ProcessoFields}
                routePath="processo"
              />
            } />

            {/* Singletons */}
            <Route path="info" element={
              <SingletonEditor
                collection="Informacoes_Gerais"
                title="Informações de Contato"
                fields={InfoFields}
              />
            } />
            <Route path="hero" element={
              <SingletonEditor
                collection="hero_stats"
                title="Topo & Estatísticas"
                fields={HeroFields}
              />
            } />

            <Route path="sobre" element={
              <SingletonEditor
                collection="about_section"
                title="Sobre / Quem Sou"
                fields={AboutFields}
              />
            } />

            <Route path="seo" element={
              <SingletonEditor
                collection="seo_config"
                title="SEO & Metadados"
                fields={SeoFields}
              />
            } />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;