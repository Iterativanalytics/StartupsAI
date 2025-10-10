import { InfographicData } from './ai-infographic-service';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'jpg';
  quality?: number;
  width?: number;
  height?: number;
  dpi?: number;
  backgroundColor?: string;
  includeMetadata?: boolean;
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  buffer?: Buffer;
  error?: string;
  metadata?: {
    size: number;
    format: string;
    dimensions: { width: number; height: number };
    generatedAt: Date;
  };
}

export class InfographicExportService {
  private browser: puppeteer.Browser | null = null;

  async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async exportInfographic(
    infographic: InfographicData,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      await this.initializeBrowser();
      
      const page = await this.browser!.newPage();
      
      // Set viewport based on options
      const width = options.width || 1200;
      const height = options.height || 800;
      await page.setViewport({ width, height, deviceScaleFactor: options.dpi ? options.dpi / 96 : 1 });

      // Generate HTML content for the infographic
      const htmlContent = this.generateHTMLContent(infographic, options);
      
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      // Wait for charts to render
      await page.waitForSelector('.chart-container', { timeout: 10000 });

      let result: ExportResult;

      switch (options.format) {
        case 'png':
          result = await this.exportAsPNG(page, options);
          break;
        case 'svg':
          result = await this.exportAsSVG(page, options);
          break;
        case 'pdf':
          result = await this.exportAsPDF(page, options);
          break;
        case 'jpg':
          result = await this.exportAsJPG(page, options);
          break;
        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }

      await page.close();
      return result;

    } catch (error) {
      console.error('Export error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async exportAsPNG(page: puppeteer.Page, options: ExportOptions): Promise<ExportResult> {
    const buffer = await page.screenshot({
      type: 'png',
      fullPage: true,
      quality: options.quality || 90
    });

    return {
      success: true,
      buffer: buffer as Buffer,
      metadata: {
        size: buffer.length,
        format: 'png',
        dimensions: { width: options.width || 1200, height: options.height || 800 },
        generatedAt: new Date()
      }
    };
  }

  private async exportAsSVG(page: puppeteer.Page, options: ExportOptions): Promise<ExportResult> {
    // For SVG export, we need to extract the SVG content from the page
    const svgContent = await page.evaluate(() => {
      const chartElement = document.querySelector('.chart-container svg');
      if (chartElement) {
        return chartElement.outerHTML;
      }
      return null;
    });

    if (!svgContent) {
      throw new Error('Could not extract SVG content');
    }

    const buffer = Buffer.from(svgContent, 'utf8');

    return {
      success: true,
      buffer,
      metadata: {
        size: buffer.length,
        format: 'svg',
        dimensions: { width: options.width || 1200, height: options.height || 800 },
        generatedAt: new Date()
      }
    };
  }

  private async exportAsPDF(page: puppeteer.Page, options: ExportOptions): Promise<ExportResult> {
    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    return {
      success: true,
      buffer: buffer as Buffer,
      metadata: {
        size: buffer.length,
        format: 'pdf',
        dimensions: { width: 595, height: 842 }, // A4 dimensions in points
        generatedAt: new Date()
      }
    };
  }

  private async exportAsJPG(page: puppeteer.Page, options: ExportOptions): Promise<ExportResult> {
    const buffer = await page.screenshot({
      type: 'jpeg',
      fullPage: true,
      quality: options.quality || 90
    });

    return {
      success: true,
      buffer: buffer as Buffer,
      metadata: {
        size: buffer.length,
        format: 'jpg',
        dimensions: { width: options.width || 1200, height: options.height || 800 },
        generatedAt: new Date()
      }
    };
  }

  private generateHTMLContent(infographic: InfographicData, options: ExportOptions): string {
    const { title, description, type, data, config } = infographic;
    const backgroundColor = options.backgroundColor || '#ffffff';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <script src="https://unpkg.com/recharts@2.13.0/umd/Recharts.js"></script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${backgroundColor};
            color: #1f2937;
            line-height: 1.6;
          }
          
          .infographic-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          
          .title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
          }
          
          .subtitle {
            font-size: 1.25rem;
            color: #6b7280;
            margin-bottom: 20px;
          }
          
          .description {
            font-size: 1rem;
            color: #4b5563;
            max-width: 600px;
            margin: 0 auto;
          }
          
          .chart-container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }
          
          .insights {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }
          
          .insights h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: #1f2937;
          }
          
          .insights ul {
            list-style: none;
          }
          
          .insights li {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
            position: relative;
            padding-left: 20px;
          }
          
          .insights li:before {
            content: "•";
            color: #3b82f6;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.875rem;
          }
          
          .metadata {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 0.875rem;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="infographic-container">
          <div class="header">
            <h1 class="title">${title}</h1>
            ${config.subtitle ? `<h2 class="subtitle">${config.subtitle}</h2>` : ''}
            ${description ? `<p class="description">${description}</p>` : ''}
          </div>
          
          <div class="chart-container">
            <div id="chart" style="width: 100%; height: 500px;"></div>
          </div>
          
          ${config.insights && config.insights.length > 0 ? `
            <div class="insights">
              <h3>Key Insights</h3>
              <ul>
                ${config.insights.map(insight => `<li>${insight}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div class="footer">
            ${config.footer || ''}
            <div class="metadata">
              <span>Generated on ${new Date().toLocaleDateString()}</span>
              <span>AI Confidence: ${Math.round((infographic.metadata?.aiConfidence || 0.85) * 100)}%</span>
            </div>
          </div>
        </div>
        
        <script>
          // Chart configuration
          const chartConfig = {
            type: '${type}',
            data: ${JSON.stringify(data)},
            colors: ${JSON.stringify(config.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'])},
            theme: '${config.theme || 'corporate'}',
            showLegend: ${config.legend !== false},
            showGrid: ${config.grid !== false},
            showTooltips: ${config.tooltips !== false}
          };
          
          // Render chart based on type
          function renderChart() {
            const container = document.getElementById('chart');
            if (!container) return;
            
            // This is a simplified version - in a real implementation,
            // you would use the actual Recharts library to render the chart
            container.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8fafc; border-radius: 8px;">
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 10px;">
                    \${chartConfig.type.toUpperCase()} CHART
                  </div>
                  <div style="color: #6b7280;">
                    Data points: \${chartConfig.data.length}
                  </div>
                </div>
              </div>
            \`;
          }
          
          // Initialize chart when page loads
          document.addEventListener('DOMContentLoaded', renderChart);
        </script>
      </body>
      </html>
    `;
  }

  async exportMultipleFormats(
    infographic: InfographicData,
    formats: ExportOptions['format'][]
  ): Promise<Record<string, ExportResult>> {
    const results: Record<string, ExportResult> = {};
    
    for (const format of formats) {
      try {
        const result = await this.exportInfographic(infographic, { format });
        results[format] = result;
      } catch (error) {
        results[format] = {
          success: false,
          error: error.message
        };
      }
    }
    
    return results;
  }

  async createZipArchive(
    infographic: InfographicData,
    formats: ExportOptions['format'][]
  ): Promise<Buffer> {
    const archiver = require('archiver');
    const { PassThrough } = require('stream');
    
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = new PassThrough();
    const chunks: Buffer[] = [];
    
    output.on('data', (chunk: Buffer) => chunks.push(chunk));
    
    const exportResults = await this.exportMultipleFormats(infographic, formats);
    
    for (const [format, result] of Object.entries(exportResults)) {
      if (result.success && result.buffer) {
        archive.append(result.buffer, { name: `infographic.${format}` });
      }
    }
    
    // Add metadata file
    const metadata = {
      title: infographic.title,
      description: infographic.description,
      type: infographic.type,
      generatedAt: infographic.metadata.generatedAt,
      aiConfidence: infographic.metadata.aiConfidence,
      version: infographic.metadata.version
    };
    
    archive.append(JSON.stringify(metadata, null, 2), { name: 'metadata.json' });
    
    await archive.finalize();
    
    return new Promise((resolve, reject) => {
      output.on('end', () => resolve(Buffer.concat(chunks)));
      output.on('error', reject);
    });
  }
}
