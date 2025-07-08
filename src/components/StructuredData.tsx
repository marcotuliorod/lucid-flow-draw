import { Helmet } from 'react-helmet-async';

export const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Flow Process",
    "description": "Designer de processos online para criar diagramas e fluxogramas de forma simples e intuitiva",
    "url": "https://yourapp.lovable.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    },
    "creator": {
      "@type": "Organization",
      "name": "Free Flow Process"
    },
    "featureList": [
      "Editor de diagramas",
      "Criação de fluxogramas",
      "Processos BPMN",
      "Colaboração em tempo real",
      "Exportação PDF"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};