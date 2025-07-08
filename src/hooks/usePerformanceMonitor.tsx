import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  timing: PerformanceTiming;
  navigation: PerformanceNavigation;
  memory?: any;
}

export const usePerformanceMonitor = () => {
  const trackPageLoad = useCallback(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      // Aguarda um pouco para garantir que todas as métricas estão disponíveis
      setTimeout(() => {
        const metrics: PerformanceMetrics = {
          timing: performance.timing,
          navigation: performance.navigation,
          memory: (performance as any).memory
        };

        const loadTime = metrics.timing.loadEventEnd - metrics.timing.navigationStart;
        const domContentLoaded = metrics.timing.domContentLoadedEventEnd - metrics.timing.navigationStart;
        const firstPaint = performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint');
        const firstContentfulPaint = performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');

        console.log('Performance Metrics:', {
          loadTime: `${loadTime}ms`,
          domContentLoaded: `${domContentLoaded}ms`,
          firstPaint: firstPaint ? `${firstPaint.startTime}ms` : 'N/A',
          firstContentfulPaint: firstContentfulPaint ? `${firstContentfulPaint.startTime}ms` : 'N/A',
          memory: metrics.memory ? {
            usedJSHeapSize: `${(metrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
            totalJSHeapSize: `${(metrics.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`
          } : 'N/A'
        });

        // Aqui você pode enviar as métricas para um serviço de analytics
        // trackEvent('performance', {
        //   loadTime,
        //   domContentLoaded,
        //   firstPaint: firstPaint?.startTime,
        //   firstContentfulPaint: firstContentfulPaint?.startTime
        // });
      }, 1000);
    });
  }, []);

  const trackInteraction = useCallback((action: string, details?: any) => {
    const timestamp = performance.now();
    console.log(`User Interaction: ${action}`, { timestamp, details });
    
    // Aqui você pode enviar para analytics
    // trackEvent('user_interaction', { action, timestamp, details });
  }, []);

  const trackError = useCallback((error: Error, errorInfo?: any) => {
    console.error('Application Error:', error, errorInfo);
    
    // Aqui você pode enviar para um serviço de error tracking
    // trackError(error, errorInfo);
  }, []);

  useEffect(() => {
    trackPageLoad();
  }, [trackPageLoad]);

  return {
    trackInteraction,
    trackError
  };
};