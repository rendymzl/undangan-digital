/**
 * Test runner for refactored architecture validation
 */

import { errorBoundaryTester } from './errorBoundaryTest';
import { routeGuardTester } from './routeGuardTest';

import type { ErrorBoundaryTestResult } from './errorBoundaryTest';
import type { RouteGuardTestResult } from './routeGuardTest';

export interface TestSuite {
  name: string;
  results: (ErrorBoundaryTestResult | RouteGuardTestResult)[];
  passed: number;
  total: number;
  success: boolean;
}

export interface TestRunnerResult {
  suites: TestSuite[];
  totalPassed: number;
  totalTests: number;
  overallSuccess: boolean;
  duration: number;
}

/**
 * Main test runner for architecture validation
 */
export class ArchitectureTestRunner {
  /**
   * Run all architecture tests
   */
  public async runAllTests(): Promise<TestRunnerResult> {
    const startTime = Date.now();
    
    console.group('🏗️ Architecture Validation Tests');
    console.log('Running comprehensive tests for refactored architecture...\n');
    
    const suites: TestSuite[] = [];
    
    // Run error boundary tests
    console.log('🧪 Running Error Boundary Tests...');
    const errorBoundaryResults = errorBoundaryTester.runAllTests();
    const errorBoundarySuite: TestSuite = {
      name: 'Error Boundary System',
      results: errorBoundaryResults,
      passed: errorBoundaryResults.filter(r => r.passed).length,
      total: errorBoundaryResults.length,
      success: errorBoundaryResults.every(r => r.passed),
    };
    suites.push(errorBoundarySuite);
    
    console.log('\n🛡️ Running Route Guard Tests...');
    const routeGuardResults = routeGuardTester.runAllTests();
    const routeGuardSuite: TestSuite = {
      name: 'Route Guard System',
      results: routeGuardResults,
      passed: routeGuardResults.filter(r => r.passed).length,
      total: routeGuardResults.length,
      success: routeGuardResults.every(r => r.passed),
    };
    suites.push(routeGuardSuite);
    
    // Calculate overall results
    const totalPassed = suites.reduce((sum, suite) => sum + suite.passed, 0);
    const totalTests = suites.reduce((sum, suite) => sum + suite.total, 0);
    const overallSuccess = suites.every(suite => suite.success);
    const duration = Date.now() - startTime;
    
    // Print summary
    console.log('\n📋 Test Summary:');
    suites.forEach(suite => {
      const status = suite.success ? '✅' : '❌';
      console.log(`${status} ${suite.name}: ${suite.passed}/${suite.total} tests passed`);
    });
    
    console.log(`\n🎯 Overall Result: ${totalPassed}/${totalTests} tests passed`);
    console.log(`⏱️ Duration: ${duration}ms`);
    
    if (overallSuccess) {
      console.log('🎉 All architecture tests passed!');
    } else {
      console.log('⚠️ Some tests failed. Please review the results above.');
    }
    
    console.groupEnd();
    
    const result: TestRunnerResult = {
      suites,
      totalPassed,
      totalTests,
      overallSuccess,
      duration,
    };
    
    return result;
  }

  /**
   * Run specific test suite
   */
  public async runTestSuite(suiteName: 'error-boundary' | 'route-guard'): Promise<TestSuite> {
    console.log(`Running ${suiteName} tests...`);
    
    switch (suiteName) {
      case 'error-boundary':
        const errorResults = errorBoundaryTester.runAllTests();
        return {
          name: 'Error Boundary System',
          results: errorResults,
          passed: errorResults.filter(r => r.passed).length,
          total: errorResults.length,
          success: errorResults.every(r => r.passed),
        };
        
      case 'route-guard':
        const routeResults = routeGuardTester.runAllTests();
        return {
          name: 'Route Guard System',
          results: routeResults,
          passed: routeResults.filter(r => r.passed).length,
          total: routeResults.length,
          success: routeResults.every(r => r.passed),
        };
        
      default:
        throw new Error(`Unknown test suite: ${suiteName}`);
    }
  }

  /**
   * Validate architecture health
   */
  public async validateArchitecture(): Promise<{
    healthy: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const result = await this.runAllTests();
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check for failed tests
    result.suites.forEach(suite => {
      if (!suite.success) {
        issues.push(`${suite.name} has ${suite.total - suite.passed} failing tests`);
        
        suite.results.forEach(test => {
          if (!test.passed) {
            issues.push(`- ${test.testName}: ${test.error || 'Test failed'}`);
          }
        });
      }
    });
    
    // Add recommendations based on results
    if (result.overallSuccess) {
      recommendations.push('Architecture is healthy and all tests pass');
      recommendations.push('Consider adding more comprehensive integration tests');
    } else {
      recommendations.push('Fix failing tests before deploying to production');
      recommendations.push('Review error handling and route guard implementations');
    }
    
    return {
      healthy: result.overallSuccess,
      issues,
      recommendations,
    };
  }
}

// Export singleton instance
export const architectureTestRunner = new ArchitectureTestRunner();

// Auto-run tests in development mode
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Add global function for manual testing
  (window as any).runArchitectureTests = () => architectureTestRunner.runAllTests();
  (window as any).validateArchitecture = () => architectureTestRunner.validateArchitecture();
  
  console.log('🧪 Architecture tests available:');
  console.log('- Run runArchitectureTests() to test the architecture');
  console.log('- Run validateArchitecture() to get health report');
}