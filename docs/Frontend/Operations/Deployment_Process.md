# Deployment Process

## 1. Tổng quan

Tài liệu này cung cấp hướng dẫn chi tiết về quy trình triển khai ứng dụng Feet Robot Manager V2, bao gồm các best practices, patterns và các ví dụ cụ thể.

### 1.1 Mục tiêu
- Đảm bảo quy trình triển khai an toàn và hiệu quả
- Tối ưu hóa hiệu suất và độ tin cậy
- Tự động hóa quy trình triển khai
- Giám sát và theo dõi sau khi triển khai
- Dễ dàng rollback khi cần thiết

### 1.2 Phạm vi
- Build Process
- Environment Configuration
- Deployment Pipeline
- Monitoring & Logging
- Rollback Procedures

## 2. Build Process

### 2.1 Build Configuration
```typescript
// ❌ Bad
// No build optimization

// ✅ Good
// webpack.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};
```

### 2.2 Environment Configuration
```typescript
// ❌ Bad
// Hardcoded environment variables

// ✅ Good
// .env.production
REACT_APP_API_URL=https://api.feetrobot.com
REACT_APP_SENTRY_DSN=https://sentry.io/your-dsn
REACT_APP_GA_TRACKING_ID=UA-XXXXX-Y

// config.ts
interface Config {
  apiUrl: string;
  sentryDsn: string;
  gaTrackingId: string;
}

const config: Config = {
  apiUrl: process.env.REACT_APP_API_URL || '',
  sentryDsn: process.env.REACT_APP_SENTRY_DSN || '',
  gaTrackingId: process.env.REACT_APP_GA_TRACKING_ID || '',
};

export default config;
```

## 3. Deployment Pipeline

### 3.1 CI/CD Configuration
```yaml
# ❌ Bad
# No CI/CD pipeline

# ✅ Good
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
          REACT_APP_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
          REACT_APP_GA_TRACKING_ID: ${{ secrets.GA_TRACKING_ID }}
          
      - name: Deploy to S3
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Upload to S3
        run: |
          aws s3 sync build/ s3://${{ secrets.S3_BUCKET }} --delete
          
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

### 3.2 Deployment Strategy
```typescript
// ❌ Bad
// No deployment strategy

// ✅ Good
// deployment-strategy.ts
interface DeploymentStrategy {
  type: 'blue-green' | 'canary' | 'rolling';
  percentage?: number;
  healthCheckPath: string;
  rollbackThreshold: number;
}

const productionStrategy: DeploymentStrategy = {
  type: 'blue-green',
  healthCheckPath: '/health',
  rollbackThreshold: 3, // Number of failed health checks before rollback
};

const stagingStrategy: DeploymentStrategy = {
  type: 'canary',
  percentage: 20,
  healthCheckPath: '/health',
  rollbackThreshold: 2,
};
```

## 4. Monitoring & Logging

### 4.1 Monitoring Setup
```typescript
// ❌ Bad
// No monitoring

// ✅ Good
// monitoring.ts
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: config.sentryDsn,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_VERSION,
});

// Track performance metrics
const metrics = {
  trackPageLoad: (name: string, duration: number) => {
    Sentry.metrics.distribution('page.load', duration, {
      tags: { page: name },
    });
  },
  
  trackApiCall: (endpoint: string, duration: number, status: number) => {
    Sentry.metrics.distribution('api.call', duration, {
      tags: { endpoint, status: String(status) },
    });
  },
};
```

### 4.2 Logging Configuration
```typescript
// ❌ Bad
// Console.log everywhere

// ✅ Good
// logger.ts
import * as Sentry from '@sentry/react';

interface LogLevel {
  debug: 0;
  info: 1;
  warn: 2;
  error: 3;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  private currentLevel: number = this.logLevel.info;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  debug(message: string, data?: any) {
    if (this.currentLevel <= this.logLevel.debug) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any) {
    if (this.currentLevel <= this.logLevel.info) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any) {
    if (this.currentLevel <= this.logLevel.warn) {
      console.warn(`[WARN] ${message}`, data);
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: data,
      });
    }
  }

  error(message: string, error?: Error) {
    if (this.currentLevel <= this.logLevel.error) {
      console.error(`[ERROR] ${message}`, error);
      Sentry.captureException(error || new Error(message));
    }
  }
}

export const logger = Logger.getInstance();
```

## 5. Rollback Procedures

### 5.1 Rollback Configuration
```typescript
// ❌ Bad
// No rollback plan

// ✅ Good
// rollback.ts
interface RollbackConfig {
  maxVersions: number;
  healthCheckInterval: number;
  maxFailedChecks: number;
  rollbackOnError: boolean;
}

const rollbackConfig: RollbackConfig = {
  maxVersions: 5,
  healthCheckInterval: 30000, // 30 seconds
  maxFailedChecks: 3,
  rollbackOnError: true,
};

class RollbackManager {
  private static instance: RollbackManager;
  private versions: string[] = [];

  private constructor() {}

  static getInstance(): RollbackManager {
    if (!RollbackManager.instance) {
      RollbackManager.instance = new RollbackManager();
    }
    return RollbackManager.instance;
  }

  async initiateRollback(version: string) {
    logger.info(`Initiating rollback to version ${version}`);
    
    try {
      // Implement rollback logic
      await this.deployVersion(version);
      logger.info(`Successfully rolled back to version ${version}`);
    } catch (error) {
      logger.error('Rollback failed', error as Error);
      throw error;
    }
  }

  private async deployVersion(version: string) {
    // Implementation of version deployment
  }
}
```

### 5.2 Health Checks
```typescript
// ❌ Bad
// No health checks

// ✅ Good
// health-check.ts
interface HealthCheck {
  name: string;
  check: () => Promise<boolean>;
  timeout: number;
}

const healthChecks: HealthCheck[] = [
  {
    name: 'API Connectivity',
    check: async () => {
      try {
        const response = await fetch(`${config.apiUrl}/health`);
        return response.ok;
      } catch (error) {
        return false;
      }
    },
    timeout: 5000,
  },
  {
    name: 'Database Connection',
    check: async () => {
      // Implement database health check
      return true;
    },
    timeout: 3000,
  },
];

class HealthCheckManager {
  private static instance: HealthCheckManager;
  private checks: HealthCheck[] = healthChecks;
  private failedChecks: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): HealthCheckManager {
    if (!HealthCheckManager.instance) {
      HealthCheckManager.instance = new HealthCheckManager();
    }
    return HealthCheckManager.instance;
  }

  async runChecks(): Promise<boolean> {
    const results = await Promise.all(
      this.checks.map(async (check) => {
        try {
          const isHealthy = await Promise.race([
            check.check(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), check.timeout)
            ),
          ]);

          if (!isHealthy) {
            this.incrementFailedChecks(check.name);
          } else {
            this.resetFailedChecks(check.name);
          }

          return isHealthy;
        } catch (error) {
          this.incrementFailedChecks(check.name);
          return false;
        }
      })
    );

    return results.every((result) => result);
  }

  private incrementFailedChecks(checkName: string) {
    const current = this.failedChecks.get(checkName) || 0;
    this.failedChecks.set(checkName, current + 1);
  }

  private resetFailedChecks(checkName: string) {
    this.failedChecks.set(checkName, 0);
  }
}
```

## 6. Best Practices

### 6.1 Deployment Guidelines
- Use semantic versioning
- Implement feature flags
- Perform database migrations carefully
- Monitor deployment metrics
- Have a rollback plan
- Test in staging environment

### 6.2 Security Practices
- Use environment variables
- Implement proper access controls
- Encrypt sensitive data
- Regular security audits
- Follow least privilege principle

## 7. Tools và Resources

### 7.1 Deployment Tools
- [GitHub Actions](https://github.com/features/actions)
- [AWS CodeDeploy](https://aws.amazon.com/codedeploy/)
- [Jenkins](https://www.jenkins.io/)
- [CircleCI](https://circleci.com/)
- [Travis CI](https://travis-ci.org/)

### 7.2 Monitoring Tools
- [Sentry](https://sentry.io/)
- [New Relic](https://newrelic.com/)
- [Datadog](https://www.datadoghq.com/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)

### 7.3 Documentation
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [AWS Deployment Guide](https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/deployment-options.html)
- [CI/CD Best Practices](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment)
- [Monitoring Best Practices](https://sre.google/sre-book/monitoring-distributed-systems/) 