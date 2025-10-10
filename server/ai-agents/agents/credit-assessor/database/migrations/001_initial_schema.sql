-- ============================================================================
-- AI Credit Scoring System - Initial Database Schema
-- PostgreSQL + TimescaleDB Migration
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "timescaledb"; -- For time-series data

-- ===========================
-- BUSINESS PROFILES
-- ===========================

CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    ein VARCHAR(20) UNIQUE,
    duns_number VARCHAR(20),
    bin VARCHAR(20), -- Business Identification Number (Experian)
    industry_naics VARCHAR(10),
    business_structure VARCHAR(50),
    years_in_business DECIMAL(5,2),
    employee_count INTEGER,
    annual_revenue DECIMAL(15,2),
    state VARCHAR(2),
    country VARCHAR(3) DEFAULT 'USA',
    
    -- Contact information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT chk_years_in_business CHECK (years_in_business >= 0),
    CONSTRAINT chk_employee_count CHECK (employee_count >= 0),
    CONSTRAINT chk_annual_revenue CHECK (annual_revenue >= 0)
);

-- ===========================
-- CREDIT SCORES (TIME-SERIES)
-- ===========================

CREATE TABLE IF NOT EXISTS credit_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    score_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Overall score
    credit_score INTEGER NOT NULL CHECK (credit_score BETWEEN 300 AND 850),
    rating VARCHAR(5) NOT NULL,
    default_probability DECIMAL(5,4) NOT NULL CHECK (default_probability BETWEEN 0 AND 1),
    confidence_level DECIMAL(3,2) NOT NULL CHECK (confidence_level BETWEEN 0 AND 1),
    model_version VARCHAR(50) NOT NULL,
    
    -- Component scores
    traditional_credit_score INTEGER CHECK (traditional_credit_score BETWEEN 300 AND 850),
    financial_health_score INTEGER CHECK (financial_health_score BETWEEN 300 AND 850),
    business_stability_score INTEGER CHECK (business_stability_score BETWEEN 300 AND 850),
    alternative_data_score INTEGER CHECK (alternative_data_score BETWEEN 300 AND 850),
    industry_risk_score INTEGER CHECK (industry_risk_score BETWEEN 300 AND 850),
    
    -- Component weights
    traditional_credit_weight DECIMAL(3,2) DEFAULT 0.35,
    financial_health_weight DECIMAL(3,2) DEFAULT 0.30,
    business_stability_weight DECIMAL(3,2) DEFAULT 0.20,
    alternative_data_weight DECIMAL(3,2) DEFAULT 0.10,
    industry_risk_weight DECIMAL(3,2) DEFAULT 0.05,
    
    -- Key factors (JSONB for flexibility)
    positive_factors JSONB,
    negative_factors JSONB,
    
    -- Explainability data
    shap_values JSONB,
    feature_importance JSONB,
    what_if_scenarios JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to TimescaleDB hypertable for time-series optimization
SELECT create_hypertable('credit_scores', 'score_date', if_not_exists => TRUE);

-- ===========================
-- TRADITIONAL CREDIT DATA
-- ===========================

CREATE TABLE IF NOT EXISTS credit_bureau_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    data_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source VARCHAR(50) NOT NULL, -- 'experian', 'dnb', 'equifax'
    
    -- Business credit
    business_credit_score INTEGER,
    paydex_score INTEGER CHECK (paydex_score BETWEEN 0 AND 100),
    total_tradelines INTEGER DEFAULT 0,
    payment_history_score INTEGER,
    credit_utilization DECIMAL(5,2),
    
    -- Personal credit (owner/guarantor)
    personal_fico_score INTEGER CHECK (personal_fico_score BETWEEN 300 AND 850),
    personal_vantage_score INTEGER CHECK (personal_vantage_score BETWEEN 300 AND 850),
    hard_inquiries_12mo INTEGER DEFAULT 0,
    
    -- Public records
    bankruptcies INTEGER DEFAULT 0,
    liens INTEGER DEFAULT 0,
    judgments INTEGER DEFAULT 0,
    collections INTEGER DEFAULT 0,
    ucc_filings INTEGER DEFAULT 0,
    
    -- Tradelines (JSONB for flexibility)
    tradelines JSONB,
    
    -- Raw API response (for audit trail)
    raw_data JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT chk_source CHECK (source IN ('experian', 'dnb', 'equifax', 'other'))
);

CREATE INDEX idx_credit_bureau_business ON credit_bureau_data(business_id, data_date DESC);
CREATE INDEX idx_credit_bureau_source ON credit_bureau_data(source);

-- ===========================
-- BANKING DATA (TIME-SERIES)
-- ===========================

CREATE TABLE IF NOT EXISTS banking_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    snapshot_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_source VARCHAR(50), -- 'plaid', 'yodlee', 'mx', 'manual'
    
    -- Account metrics
    average_balance DECIMAL(15,2),
    minimum_balance DECIMAL(15,2),
    maximum_balance DECIMAL(15,2),
    balance_volatility DECIMAL(5,4),
    
    -- Transaction metrics
    deposits_per_month INTEGER,
    deposit_consistency DECIMAL(3,2) CHECK (deposit_consistency BETWEEN 0 AND 1),
    withdrawals_per_month INTEGER,
    average_deposit_amount DECIMAL(15,2),
    average_withdrawal_amount DECIMAL(15,2),
    
    -- Risk indicators
    overdrafts_3mo INTEGER DEFAULT 0,
    nsf_incidents_3mo INTEGER DEFAULT 0,
    days_negative_balance INTEGER DEFAULT 0,
    
    -- Cash flow
    operating_cash_flow DECIMAL(15,2),
    cash_burn_rate DECIMAL(15,2),
    runway_months DECIMAL(5,2),
    cash_flow_volatility DECIMAL(5,4),
    
    -- Detailed transactions (JSONB)
    transactions JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT create_hypertable('banking_data', 'snapshot_date', if_not_exists => TRUE);

CREATE INDEX idx_banking_business ON banking_data(business_id, snapshot_date DESC);

-- ===========================
-- FINANCIAL STATEMENTS
-- ===========================

CREATE TABLE IF NOT EXISTS financial_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    statement_date DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- 'monthly', 'quarterly', 'annual'
    source VARCHAR(50), -- 'quickbooks', 'xero', 'freshbooks', 'manual'
    
    -- Income statement
    revenue DECIMAL(15,2),
    cogs DECIMAL(15,2),
    gross_profit DECIMAL(15,2),
    operating_expenses DECIMAL(15,2),
    ebitda DECIMAL(15,2),
    ebit DECIMAL(15,2),
    interest_expense DECIMAL(15,2),
    tax_expense DECIMAL(15,2),
    net_income DECIMAL(15,2),
    
    -- Balance sheet
    total_assets DECIMAL(15,2),
    current_assets DECIMAL(15,2),
    cash DECIMAL(15,2),
    accounts_receivable DECIMAL(15,2),
    inventory DECIMAL(15,2),
    fixed_assets DECIMAL(15,2),
    
    total_liabilities DECIMAL(15,2),
    current_liabilities DECIMAL(15,2),
    accounts_payable DECIMAL(15,2),
    short_term_debt DECIMAL(15,2),
    long_term_debt DECIMAL(15,2),
    total_debt DECIMAL(15,2),
    
    equity DECIMAL(15,2),
    retained_earnings DECIMAL(15,2),
    
    -- Cash flow statement
    operating_cash_flow DECIMAL(15,2),
    investing_cash_flow DECIMAL(15,2),
    financing_cash_flow DECIMAL(15,2),
    net_cash_flow DECIMAL(15,2),
    
    -- Financial ratios (calculated)
    current_ratio DECIMAL(5,2),
    quick_ratio DECIMAL(5,2),
    debt_to_equity DECIMAL(5,2),
    debt_to_assets DECIMAL(5,2),
    debt_service_coverage DECIMAL(5,2),
    gross_margin DECIMAL(5,4),
    net_margin DECIMAL(5,4),
    operating_margin DECIMAL(5,4),
    roa DECIMAL(5,4),
    roe DECIMAL(5,4),
    asset_turnover DECIMAL(5,2),
    
    -- Full statements (JSONB)
    full_income_statement JSONB,
    full_balance_sheet JSONB,
    full_cash_flow JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT chk_period_type CHECK (period_type IN ('monthly', 'quarterly', 'annual')),
    UNIQUE(business_id, statement_date, period_type)
);

CREATE INDEX idx_financial_statements_business ON financial_statements(business_id, statement_date DESC);
CREATE INDEX idx_financial_statements_period ON financial_statements(period_type);

-- ===========================
-- ALTERNATIVE DATA
-- ===========================

CREATE TABLE IF NOT EXISTS alternative_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    data_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Digital presence
    domain_age_years DECIMAL(5,2),
    website_traffic_monthly INTEGER,
    website_quality_score DECIMAL(3,2),
    ssl_certificate BOOLEAN,
    mobile_friendly BOOLEAN,
    seo_score INTEGER CHECK (seo_score BETWEEN 0 AND 100),
    
    -- Social media
    total_followers INTEGER,
    social_engagement_rate DECIMAL(5,4),
    social_sentiment_score DECIMAL(3,2) CHECK (social_sentiment_score BETWEEN -1 AND 1),
    
    -- Online reviews
    google_rating DECIMAL(2,1) CHECK (google_rating BETWEEN 0 AND 5),
    google_review_count INTEGER,
    yelp_rating DECIMAL(2,1) CHECK (yelp_rating BETWEEN 0 AND 5),
    yelp_review_count INTEGER,
    bbb_rating VARCHAR(5),
    review_response_rate DECIMAL(3,2),
    
    -- Customer metrics
    total_customers INTEGER,
    repeat_customer_rate DECIMAL(3,2),
    customer_churn_rate DECIMAL(3,2),
    customer_lifetime_value DECIMAL(15,2),
    customer_acquisition_cost DECIMAL(15,2),
    ltv_cac_ratio DECIMAL(5,2),
    
    -- Full data (JSONB)
    digital_footprint JSONB,
    social_media_data JSONB,
    review_data JSONB,
    customer_metrics JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alternative_data_business ON alternative_data(business_id, data_date DESC);

-- ===========================
-- LOAN APPLICATIONS
-- ===========================

CREATE TABLE IF NOT EXISTS loan_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    application_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    application_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Loan details
    requested_amount DECIMAL(15,2) NOT NULL CHECK (requested_amount > 0),
    requested_term_months INTEGER NOT NULL CHECK (requested_term_months > 0),
    purpose TEXT,
    use_of_funds VARCHAR(100),
    
    -- Collateral
    collateral_type VARCHAR(100),
    collateral_value DECIMAL(15,2),
    collateral_description TEXT,
    
    -- Decision
    decision VARCHAR(50), -- 'approved', 'conditional', 'declined', 'review', 'pending'
    decision_date TIMESTAMPTZ,
    decision_reason TEXT,
    
    approved_amount DECIMAL(15,2),
    interest_rate DECIMAL(5,2),
    approved_term_months INTEGER,
    monthly_payment DECIMAL(10,2),
    
    -- Conditions
    conditions JSONB,
    required_documents JSONB,
    
    -- Scores at application
    credit_score_id UUID REFERENCES credit_scores(id),
    credit_score_at_application INTEGER,
    default_probability_at_application DECIMAL(5,4),
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending',
    status_history JSONB,
    
    -- Underwriter notes
    underwriter_id UUID,
    underwriter_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT chk_decision CHECK (decision IN ('approved', 'conditional', 'declined', 'review', 'pending')),
    CONSTRAINT chk_status CHECK (status IN ('pending', 'in_review', 'approved', 'declined', 'withdrawn', 'funded'))
);

CREATE INDEX idx_loan_applications_business ON loan_applications(business_id, application_date DESC);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_loan_applications_decision ON loan_applications(decision);

-- ===========================
-- ACTIVE LOANS
-- ===========================

CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES loan_applications(id),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    loan_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Loan terms
    principal_amount DECIMAL(15,2) NOT NULL CHECK (principal_amount > 0),
    interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 0),
    term_months INTEGER NOT NULL CHECK (term_months > 0),
    monthly_payment DECIMAL(10,2) NOT NULL CHECK (monthly_payment > 0),
    
    -- Dates
    origination_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    first_payment_date DATE NOT NULL,
    last_payment_date DATE,
    
    -- Current status
    outstanding_balance DECIMAL(15,2),
    principal_paid DECIMAL(15,2) DEFAULT 0,
    interest_paid DECIMAL(15,2) DEFAULT 0,
    payments_made INTEGER DEFAULT 0,
    payments_remaining INTEGER,
    
    current_status VARCHAR(50) DEFAULT 'current',
    days_past_due INTEGER DEFAULT 0,
    delinquency_status VARCHAR(50),
    
    -- Risk metrics (updated periodically)
    current_credit_score INTEGER,
    current_default_probability DECIMAL(5,4),
    risk_rating VARCHAR(10),
    last_monitored_date TIMESTAMPTZ,
    
    -- Collateral
    collateral_type VARCHAR(100),
    collateral_value DECIMAL(15,2),
    collateral_status VARCHAR(50),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT chk_current_status CHECK (current_status IN ('current', 'late', 'delinquent', 'default', 'paid_off', 'charged_off')),
    CONSTRAINT chk_outstanding_balance CHECK (outstanding_balance >= 0)
);

CREATE INDEX idx_loans_business ON loans(business_id);
CREATE INDEX idx_loans_status ON loans(current_status);
CREATE INDEX idx_loans_origination ON loans(origination_date DESC);

-- ===========================
-- LOAN PAYMENTS
-- ===========================

CREATE TABLE IF NOT EXISTS loan_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    payment_amount DECIMAL(10,2) NOT NULL CHECK (payment_amount >= 0),
    principal_amount DECIMAL(10,2) NOT NULL CHECK (principal_amount >= 0),
    interest_amount DECIMAL(10,2) NOT NULL CHECK (interest_amount >= 0),
    fees_amount DECIMAL(10,2) DEFAULT 0,
    
    payment_status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    
    days_late INTEGER DEFAULT 0,
    late_fee DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('scheduled', 'paid', 'late', 'missed', 'partial'))
);

CREATE INDEX idx_loan_payments_loan ON loan_payments(loan_id, payment_date DESC);
CREATE INDEX idx_loan_payments_status ON loan_payments(payment_status);

-- ===========================
-- LOAN MONITORING EVENTS (TIME-SERIES)
-- ===========================

CREATE TABLE IF NOT EXISTS loan_monitoring_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type VARCHAR(50) NOT NULL,
    
    -- Metrics at time of event
    credit_score INTEGER,
    score_change INTEGER,
    default_probability DECIMAL(5,4),
    risk_change DECIMAL(5,4),
    
    -- Alert information
    alert_level VARCHAR(20), -- 'info', 'warning', 'critical'
    alert_message TEXT,
    alert_triggers JSONB,
    
    -- Actions
    action_required VARCHAR(50),
    action_taken VARCHAR(50),
    action_date TIMESTAMPTZ,
    action_by UUID,
    action_notes TEXT,
    
    -- Event data
    event_data JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT chk_event_type CHECK (event_type IN ('score_change', 'payment', 'alert', 'review', 'status_change', 'covenant_breach')),
    CONSTRAINT chk_alert_level CHECK (alert_level IN ('info', 'warning', 'critical'))
);

SELECT create_hypertable('loan_monitoring_events', 'event_date', if_not_exists => TRUE);

CREATE INDEX idx_monitoring_loan ON loan_monitoring_events(loan_id, event_date DESC);
CREATE INDEX idx_monitoring_alert_level ON loan_monitoring_events(alert_level) WHERE alert_level IN ('warning', 'critical');

-- ===========================
-- MODEL VERSIONS
-- ===========================

CREATE TABLE IF NOT EXISTS model_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version VARCHAR(50) UNIQUE NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    model_name VARCHAR(100),
    
    -- Training information
    training_date TIMESTAMPTZ NOT NULL,
    training_samples INTEGER,
    training_duration_seconds INTEGER,
    
    -- Performance metrics
    validation_auc DECIMAL(5,4),
    validation_accuracy DECIMAL(5,4),
    validation_precision DECIMAL(5,4),
    validation_recall DECIMAL(5,4),
    validation_f1 DECIMAL(5,4),
    ks_statistic DECIMAL(5,4),
    gini_coefficient DECIMAL(5,4),
    
    -- Model artifacts
    model_path VARCHAR(500),
    feature_list JSONB,
    feature_count INTEGER,
    hyperparameters JSONB,
    
    -- Deployment
    deployed_date TIMESTAMPTZ,
    deprecated_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    description TEXT,
    trained_by VARCHAR(100),
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT chk_model_type CHECK (model_type IN ('xgboost', 'neural_net', 'random_forest', 'logistic', 'ensemble'))
);

CREATE INDEX idx_model_versions_active ON model_versions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_model_versions_type ON model_versions(model_type);

-- ===========================
-- MODEL PERFORMANCE MONITORING (TIME-SERIES)
-- ===========================

CREATE TABLE IF NOT EXISTS model_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_version VARCHAR(50) NOT NULL REFERENCES model_versions(version),
    evaluation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    evaluation_period VARCHAR(20), -- '1d', '7d', '30d'
    
    -- Performance metrics
    auc_roc DECIMAL(5,4),
    precision DECIMAL(5,4),
    recall DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    ks_statistic DECIMAL(5,4),
    gini_coefficient DECIMAL(5,4),
    
    -- Calibration metrics
    brier_score DECIMAL(5,4),
    calibration_error DECIMAL(5,4),
    
    -- Fairness metrics
    demographic_parity DECIMAL(5,4),
    equal_opportunity DECIMAL(5,4),
    disparate_impact DECIMAL(5,4),
    
    -- Drift detection
    feature_drift_score DECIMAL(5,4),
    prediction_drift_score DECIMAL(5,4),
    data_drift_detected BOOLEAN DEFAULT FALSE,
    
    -- Sample statistics
    total_predictions INTEGER,
    total_actuals INTEGER,
    
    -- Detailed metrics
    confusion_matrix JSONB,
    roc_curve_data JSONB,
    precision_recall_curve JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT create_hypertable('model_performance', 'evaluation_date', if_not_exists => TRUE);

CREATE INDEX idx_model_performance_version ON model_performance(model_version, evaluation_date DESC);

-- ===========================
-- AUDIT LOG
-- ===========================

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Event information
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    
    -- User information
    user_id UUID,
    user_email VARCHAR(255),
    user_role VARCHAR(50),
    
    -- Action details
    action VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Data changes
    old_values JSONB,
    new_values JSONB,
    
    -- Request metadata
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT create_hypertable('audit_log', 'event_date', if_not_exists => TRUE);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id, event_date DESC);
CREATE INDEX idx_audit_log_user ON audit_log(user_id, event_date DESC);
CREATE INDEX idx_audit_log_type ON audit_log(event_type);

-- ===========================
-- INDEXES FOR PERFORMANCE
-- ===========================

-- Business search
CREATE INDEX idx_businesses_ein ON businesses(ein) WHERE ein IS NOT NULL;
CREATE INDEX idx_businesses_duns ON businesses(duns_number) WHERE duns_number IS NOT NULL;
CREATE INDEX idx_businesses_name_trgm ON businesses USING gin(business_name gin_trgm_ops);

-- Credit scores
CREATE INDEX idx_credit_scores_business_latest ON credit_scores(business_id, score_date DESC);
CREATE INDEX idx_credit_scores_rating ON credit_scores(rating);
CREATE INDEX idx_credit_scores_model ON credit_scores(model_version);

-- Loan applications
CREATE INDEX idx_loan_apps_number ON loan_applications(application_number);
CREATE INDEX idx_loan_apps_date ON loan_applications(application_date DESC);

-- Loans
CREATE INDEX idx_loans_number ON loans(loan_number);
CREATE INDEX idx_loans_maturity ON loans(maturity_date);
CREATE INDEX idx_loans_risk ON loans(risk_rating) WHERE risk_rating IS NOT NULL;

-- ===========================
-- FUNCTIONS & TRIGGERS
-- ===========================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loan_applications_updated_at BEFORE UPDATE ON loan_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate financial ratios automatically
CREATE OR REPLACE FUNCTION calculate_financial_ratios()
RETURNS TRIGGER AS $$
BEGIN
    -- Current ratio
    IF NEW.current_liabilities > 0 THEN
        NEW.current_ratio = NEW.current_assets / NEW.current_liabilities;
    END IF;
    
    -- Quick ratio
    IF NEW.current_liabilities > 0 THEN
        NEW.quick_ratio = (NEW.current_assets - COALESCE(NEW.inventory, 0)) / NEW.current_liabilities;
    END IF;
    
    -- Debt to equity
    IF NEW.equity > 0 THEN
        NEW.debt_to_equity = NEW.total_debt / NEW.equity;
    END IF;
    
    -- Debt to assets
    IF NEW.total_assets > 0 THEN
        NEW.debt_to_assets = NEW.total_debt / NEW.total_assets;
    END IF;
    
    -- Margins
    IF NEW.revenue > 0 THEN
        NEW.gross_margin = NEW.gross_profit / NEW.revenue;
        NEW.net_margin = NEW.net_income / NEW.revenue;
        NEW.operating_margin = (NEW.revenue - NEW.operating_expenses) / NEW.revenue;
    END IF;
    
    -- ROA and ROE
    IF NEW.total_assets > 0 THEN
        NEW.roa = NEW.net_income / NEW.total_assets;
    END IF;
    
    IF NEW.equity > 0 THEN
        NEW.roe = NEW.net_income / NEW.equity;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_ratios BEFORE INSERT OR UPDATE ON financial_statements
    FOR EACH ROW EXECUTE FUNCTION calculate_financial_ratios();

-- ===========================
-- VIEWS FOR COMMON QUERIES
-- ===========================

-- Latest credit score per business
CREATE OR REPLACE VIEW latest_credit_scores AS
SELECT DISTINCT ON (business_id)
    business_id,
    credit_score,
    rating,
    default_probability,
    confidence_level,
    score_date,
    model_version
FROM credit_scores
ORDER BY business_id, score_date DESC;

-- Active loans summary
CREATE OR REPLACE VIEW active_loans_summary AS
SELECT 
    l.id,
    l.loan_number,
    l.business_id,
    b.business_name,
    l.principal_amount,
    l.outstanding_balance,
    l.interest_rate,
    l.current_status,
    l.days_past_due,
    l.current_credit_score,
    l.current_default_probability,
    l.risk_rating,
    l.origination_date,
    l.maturity_date
FROM loans l
JOIN businesses b ON l.business_id = b.id
WHERE l.current_status NOT IN ('paid_off', 'charged_off');

-- Portfolio risk metrics
CREATE OR REPLACE VIEW portfolio_risk_metrics AS
SELECT 
    COUNT(*) as total_loans,
    SUM(outstanding_balance) as total_exposure,
    AVG(current_default_probability) as avg_default_probability,
    SUM(outstanding_balance * current_default_probability * 0.45) as expected_loss,
    COUNT(*) FILTER (WHERE current_status = 'late') as late_loans,
    COUNT(*) FILTER (WHERE current_status = 'delinquent') as delinquent_loans,
    COUNT(*) FILTER (WHERE days_past_due > 30) as past_due_30,
    COUNT(*) FILTER (WHERE days_past_due > 60) as past_due_60,
    COUNT(*) FILTER (WHERE days_past_due > 90) as past_due_90
FROM loans
WHERE current_status NOT IN ('paid_off', 'charged_off');

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO credit_scoring_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO credit_scoring_app;

COMMENT ON TABLE businesses IS 'Core business profile information';
COMMENT ON TABLE credit_scores IS 'Time-series credit scores with explainability data';
COMMENT ON TABLE credit_bureau_data IS 'Traditional credit bureau data from Experian, D&B, Equifax';
COMMENT ON TABLE banking_data IS 'Banking and transaction data from Plaid, Yodlee, etc.';
COMMENT ON TABLE financial_statements IS 'Financial statements from accounting software';
COMMENT ON TABLE alternative_data IS 'Alternative data sources (digital footprint, reviews, etc.)';
COMMENT ON TABLE loan_applications IS 'Loan application records with decisions';
COMMENT ON TABLE loans IS 'Active loan portfolio';
COMMENT ON TABLE loan_monitoring_events IS 'Time-series monitoring events and alerts';
COMMENT ON TABLE model_versions IS 'ML model version registry';
COMMENT ON TABLE model_performance IS 'Time-series model performance metrics';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail';
