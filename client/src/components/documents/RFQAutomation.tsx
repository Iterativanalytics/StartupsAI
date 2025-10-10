/**
 * RFQAutomation
 * @package components
 * @subpackage documents
 * @since 0.1.0
 */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function RFQAutomation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          RFQ Automation
        </CardTitle>
        <CardDescription>
          Request for Quotation automation coming soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          This feature is under development and will be available soon.
        </p>
      </CardContent>
    </Card>
  );
}
