export const PROMPT_TEMPLATES = {
  // Entrepreneur prompts
  BUSINESS_PLAN_REVIEW: `Analyze the following business plan and provide specific, actionable feedback:
{business_plan}

Focus on:
1. Market opportunity and competitive advantage
2. Financial projections and assumptions
3. Team capabilities
4. Go-to-market strategy
5. Risk factors and mitigation`,

  FINANCIAL_ADVICE: `Based on the following financial data:
{financial_data}

Provide guidance on:
1. Cash management and runway
2. Burn rate optimization
3. Revenue growth strategies
4. Fundraising timing and approach
5. Key metrics to track`,

  // Investor prompts
  DEAL_EVALUATION: `Evaluate this investment opportunity:
Company: {company_name}
Stage: {stage}
Valuation: {valuation}
Revenue: {revenue}
Growth: {growth_rate}
Team: {team_info}

Provide analysis on:
1. Valuation reasonableness
2. Growth potential
3. Market size and dynamics
4. Team strength
5. Risk factors
6. Investment recommendation`,

  PORTFOLIO_ANALYSIS: `Analyze this investment portfolio:
{portfolio_data}

Provide insights on:
1. Diversification across sectors and stages
2. Performance metrics and trends
3. Risk concentration
4. Opportunities for rebalancing
5. Exit potential`,

  // Lender prompts
  CREDIT_ASSESSMENT: `Assess this loan application:
Applicant: {applicant_name}
Requested Amount: {amount}
Purpose: {purpose}
Credit Score: {credit_score}
Annual Revenue: {revenue}
Debt-to-Income: {dti}
Collateral: {collateral}

Evaluate:
1. Credit worthiness
2. Repayment capacity
3. Collateral adequacy
4. Risk level
5. Recommended terms or rejection`,

  // Grantor prompts
  IMPACT_EVALUATION: `Evaluate the impact potential of this grant application:
Organization: {org_name}
Program: {program_description}
Requested Amount: {amount}
Target Beneficiaries: {beneficiaries}
Success Metrics: {metrics}

Assess:
1. Social/environmental impact potential
2. Sustainability and scalability
3. Team capability
4. Measurement and reporting plan
5. Funding recommendation`,

  // Partner prompts
  STARTUP_MATCHING: `Find the best startups for this partnership opportunity:
Partner: {partner_name}
Focus Areas: {focus_areas}
Program Type: {program_type}
Resources Available: {resources}
Success Criteria: {criteria}

Available Startups:
{startup_list}

Recommend:
1. Top 5 matches with compatibility scores
2. Reasoning for each match
3. Potential challenges
4. Success probability`
};

export function fillTemplate(template: string, variables: Record<string, any>): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value));
  }
  
  return result;
}