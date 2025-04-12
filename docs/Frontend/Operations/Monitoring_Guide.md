# Monitoring Guide

## 1. Overview
This document outlines the monitoring strategy and procedures for the Feet Manager Robot V2 frontend application.

## 2. Monitoring Tools
- **Application Performance Monitoring (APM)**
  - New Relic
  - Sentry
  - Custom logging system

- **User Experience Monitoring**
  - Google Analytics
  - Hotjar
  - Custom user tracking

- **Infrastructure Monitoring**
  - Prometheus
  - Grafana
  - CloudWatch

## 3. Key Metrics
### 3.1 Performance Metrics
- Page load time
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

### 3.2 Error Metrics
- JavaScript errors
- API errors
- Network errors
- Resource loading errors

### 3.3 User Metrics
- Active users
- Session duration
- Page views
- User actions
- Conversion rates

## 4. Alerting Strategy
### 4.1 Alert Levels
- **Critical**: System down, major functionality broken
- **High**: Performance degradation, multiple errors
- **Medium**: Single feature issues, minor performance problems
- **Low**: Non-critical issues, warnings

### 4.2 Alert Channels
- Email notifications
- Slack integration
- SMS alerts (for critical issues)
- PagerDuty integration

## 5. Monitoring Setup
### 5.1 New Relic Configuration
```typescript
// newrelic.js
'use strict'

exports.config = {
  app_name: ['Feet-Manager-Robot-V2'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
    filepath: 'stdout'
  },
  distributed_tracing: {
    enabled: true
  },
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    record_sql: 'obfuscated',
    stack_trace_threshold: '0.5'
  },
  error_collector: {
    enabled: true,
    ignore_status_codes: [404]
  }
}
```

### 5.2 Sentry Configuration
```typescript
// sentry.config.ts
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_VERSION,
  beforeSend(event) {
    if (event.exception) {
      // Filter out known non-critical errors
      const error = event.exception.values?.[0]
      if (error?.type === 'NetworkError') {
        return null
      }
    }
    return event
  }
})
```

## 6. Logging Strategy
### 6.1 Log Levels
- ERROR: System errors, failed operations
- WARN: Potential issues, deprecated features
- INFO: General operational information
- DEBUG: Detailed debugging information
- TRACE: Very detailed tracing information

### 6.2 Log Format
```typescript
interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';
  message: string;
  context: {
    userId?: string;
    sessionId?: string;
    component?: string;
    action?: string;
    [key: string]: any;
  };
  error?: Error;
}
```

## 7. Performance Monitoring
### 7.1 Web Vitals Monitoring
```typescript
// web-vitals.ts
import { getCLS, getFID, getLCP, getTTFB, getFCP } from 'web-vitals'

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric)
  navigator.sendBeacon('/analytics', body)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
getFCP(sendToAnalytics)
```

### 7.2 Custom Performance Metrics
```typescript
// performance-monitoring.ts
export const measurePerformance = {
  startTime: (metricName: string) => {
    performance.mark(`${metricName}-start`)
  },
  
  endTime: (metricName: string) => {
    performance.mark(`${metricName}-end`)
    performance.measure(
      metricName,
      `${metricName}-start`,
      `${metricName}-end`
    )
  },
  
  getMetrics: () => {
    return performance.getEntriesByType('measure')
  }
}
```

## 8. Error Tracking
### 8.1 Global Error Handler
```typescript
// error-handler.ts
window.addEventListener('error', (event) => {
  const error = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  }
  
  // Send to error tracking service
  sendErrorToService(error)
  
  // Prevent default error handling
  event.preventDefault()
})

window.addEventListener('unhandledrejection', (event) => {
  const error = {
    message: event.reason?.message || 'Unhandled promise rejection',
    stack: event.reason?.stack,
    promise: event.promise
  }
  
  // Send to error tracking service
  sendErrorToService(error)
})
```

## 9. User Behavior Tracking
### 9.1 Custom Event Tracking
```typescript
// analytics.ts
export const trackEvent = (category: string, action: string, label?: string) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    })
  }
  
  // Send to custom analytics
  sendToCustomAnalytics({
    category,
    action,
    label,
    timestamp: new Date().toISOString()
  })
}
```

## 10. Monitoring Dashboard
### 10.1 Dashboard Components
- Real-time performance metrics
- Error rate and types
- User activity
- System health status
- Resource usage
- API performance

### 10.2 Dashboard Access
- Development team: Full access
- Operations team: Full access
- Management: Read-only access
- External stakeholders: Limited access

## 11. Maintenance Procedures
### 11.1 Regular Checks
- Daily: Error logs review
- Weekly: Performance metrics analysis
- Monthly: System health assessment
- Quarterly: Monitoring strategy review

### 11.2 Incident Response
1. Alert received
2. Initial assessment
3. Severity determination
4. Team notification
5. Investigation
6. Resolution
7. Post-mortem analysis

## 12. Best Practices
1. Monitor proactively, not reactively
2. Set appropriate alert thresholds
3. Maintain clear escalation paths
4. Document all monitoring procedures
5. Regularly review and update monitoring strategy
6. Test alerting systems regularly
7. Keep monitoring tools up to date
8. Maintain proper access controls
9. Document all custom metrics
10. Regular performance baseline updates

## 13. Related Documentation
- [Deployment Process](../Operations/Deployment_Process.md)
- [Security Standards](../Operations/Security_Standards.md)
- [Performance Optimization](../Development/Performance_Optimization.md)
- [Error Handling](../Development/Error_Handling.md) 