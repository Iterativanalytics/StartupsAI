-- Lean Design Thinking™ Integration - Database Schema
-- Migration: 001_add_dt_tables.sql

-- Lean Design Thinking™ Projects
CREATE TABLE dt_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_plan_id UUID REFERENCES business_plans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  current_phase VARCHAR(50) CHECK (current_phase IN ('empathize', 'define', 'ideate', 'prototype', 'test')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Empathy Maps
CREATE TABLE empathy_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES dt_projects(id) ON DELETE CASCADE,
  user_persona VARCHAR(255) NOT NULL,
  think_and_feel TEXT[] DEFAULT '{}',
  say_and_do TEXT[] DEFAULT '{}',
  see TEXT[] DEFAULT '{}',
  hear TEXT[] DEFAULT '{}',
  pains TEXT[] DEFAULT '{}',
  gains TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Journey Maps
CREATE TABLE user_journey_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES dt_projects(id) ON DELETE CASCADE,
  journey_name VARCHAR(255) NOT NULL,
  description TEXT,
  stages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POV Statements
CREATE TABLE pov_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES dt_projects(id) ON DELETE CASCADE,
  user_description TEXT NOT NULL,
  need TEXT NOT NULL,
  insight TEXT NOT NULL,
  supporting_evidence JSONB DEFAULT '{}',
  validated BOOLEAN DEFAULT FALSE,
  validation_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HMW Questions
CREATE TABLE hmw_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pov_statement_id UUID REFERENCES pov_statements(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  reframing_type VARCHAR(50),
  desirability INTEGER CHECK (desirability >= 1 AND desirability <= 5),
  feasibility INTEGER CHECK (feasibility >= 1 AND feasibility <= 5),
  viability INTEGER CHECK (viability >= 1 AND viability <= 5),
  priority_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brainstorm Sessions
CREATE TABLE brainstorm_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hmw_question_id UUID REFERENCES hmw_questions(id) ON DELETE CASCADE,
  facilitator_id UUID REFERENCES users(id),
  method VARCHAR(50) CHECK (method IN ('crazy-8s', 'brainwriting', 'scamper', 'reverse-brainstorming', 'mind-mapping')),
  duration INTEGER, -- minutes
  participants JSONB DEFAULT '[]',
  rules JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ideas
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brainstorm_session_id UUID REFERENCES brainstorm_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  parent_idea_id UUID REFERENCES ideas(id),
  votes INTEGER DEFAULT 0,
  category VARCHAR(100),
  feasibility_score INTEGER CHECK (feasibility_score >= 1 AND feasibility_score <= 5),
  desirability_score INTEGER CHECK (desirability_score >= 1 AND desirability_score <= 5),
  viability_score INTEGER CHECK (viability_score >= 1 AND viability_score <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prototypes
CREATE TABLE prototypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  learning_goals TEXT[] DEFAULT '{}',
  success_metrics TEXT[] DEFAULT '{}',
  fidelity VARCHAR(20) CHECK (fidelity IN ('lo-fi', 'mid-fi', 'hi-fi', 'experience')),
  method VARCHAR(50) CHECK (method IN ('sketch', 'paper', 'wireframe', 'storyboard', 'wizard-of-oz', 'role-play', 'functional')),
  effort_estimate INTEGER, -- hours
  actual_effort INTEGER, -- hours
  assets JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'testing', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Sessions
CREATE TABLE test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prototype_id UUID REFERENCES prototypes(id) ON DELETE CASCADE,
  test_date TIMESTAMP NOT NULL,
  facilitator_id UUID REFERENCES users(id),
  participants JSONB DEFAULT '[]',
  test_script JSONB DEFAULT '{}',
  observations JSONB DEFAULT '[]',
  synthesis_notes TEXT,
  decision VARCHAR(50) CHECK (decision IN ('pivot', 'persevere', 'efficient-failure', 'flawed-success')),
  next_steps TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venture Hypotheses
CREATE TABLE venture_hypotheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_plan_id UUID REFERENCES business_plans(id) ON DELETE CASCADE,
  type VARCHAR(50) CHECK (type IN ('customer', 'problem', 'solution', 'channel', 'revenue', 'cost')),
  statement TEXT NOT NULL,
  risk_level VARCHAR(20) CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  test_method VARCHAR(50) CHECK (test_method IN ('interview', 'prototype', 'landing-page', 'concierge', 'wizard-of-oz', 'mvp')),
  success_criteria TEXT,
  status VARCHAR(20) CHECK (status IN ('untested', 'testing', 'validated', 'invalidated')),
  test_results JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BML Cycles
CREATE TABLE bml_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES dt_projects(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL,
  learning_goal TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  metrics JSONB DEFAULT '[]',
  mvp_description TEXT,
  effort_estimate INTEGER, -- hours
  actual_effort INTEGER, -- hours
  results TEXT,
  validated BOOLEAN DEFAULT FALSE,
  insights TEXT[],
  next_action VARCHAR(20) CHECK (next_action IN ('pivot', 'persevere', 'iterate')),
  next_cycle_id UUID REFERENCES bml_cycles(id),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Design Sprints
CREATE TABLE design_sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES dt_projects(id) ON DELETE CASCADE,
  sprint_goal TEXT NOT NULL,
  sprint_questions TEXT[] DEFAULT '{}',
  target_moment TEXT,
  decider_id UUID REFERENCES users(id),
  facilitator_id UUID REFERENCES users(id),
  maker_id UUID REFERENCES users(id),
  customer_rep_id UUID REFERENCES users(id),
  cynic_id UUID REFERENCES users(id),
  duration INTEGER DEFAULT 5 CHECK (duration IN (4, 5)),
  start_date TIMESTAMP NOT NULL,
  deliverables JSONB DEFAULT '{}',
  final_decision VARCHAR(20) CHECK (final_decision IN ('pivot', 'persevere', 'iterate')),
  next_steps TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LDT Readiness Assessments
CREATE TABLE dt_readiness_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  psychological_safety INTEGER CHECK (psychological_safety >= 0 AND psychological_safety <= 100),
  experimentation_tolerance INTEGER CHECK (experimentation_tolerance >= 0 AND experimentation_tolerance <= 100),
  failure_stigma INTEGER CHECK (failure_stigma >= 0 AND failure_stigma <= 100),
  hierarchy_rigidity INTEGER CHECK (hierarchy_rigidity >= 0 AND hierarchy_rigidity <= 100),
  innovation_culture INTEGER CHECK (innovation_culture >= 0 AND innovation_culture <= 100),
  collaboration_level INTEGER CHECK (collaboration_level >= 0 AND collaboration_level <= 100),
  time_allocation INTEGER CHECK (time_allocation >= 0 AND time_allocation <= 100),
  budget_allocation DECIMAL(10,2),
  training_completed BOOLEAN DEFAULT FALSE,
  expert_availability INTEGER CHECK (expert_availability >= 0 AND expert_availability <= 100),
  process_flexibility INTEGER CHECK (process_flexibility >= 0 AND process_flexibility <= 100),
  decision_making_speed INTEGER CHECK (decision_making_speed >= 0 AND decision_making_speed <= 100),
  digital_maturity INTEGER CHECK (digital_maturity >= 0 AND digital_maturity <= 100),
  tool_adoption INTEGER CHECK (tool_adoption >= 0 AND tool_adoption <= 100),
  data_readiness INTEGER CHECK (data_readiness >= 0 AND data_readiness <= 100),
  overall_readiness VARCHAR(20) CHECK (overall_readiness IN ('not-ready', 'partially-ready', 'ready', 'highly-ready')),
  critical_blockers TEXT[],
  recommendations TEXT[],
  risk_factors JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_empathy_maps_project_id ON empathy_maps(project_id);
CREATE INDEX idx_empathy_maps_created_at ON empathy_maps(created_at);

CREATE INDEX idx_user_journey_maps_project_id ON user_journey_maps(project_id);
CREATE INDEX idx_user_journey_maps_created_at ON user_journey_maps(created_at);

CREATE INDEX idx_pov_statements_project_id ON pov_statements(project_id);
CREATE INDEX idx_pov_statements_validated ON pov_statements(validated);

CREATE INDEX idx_hmw_questions_pov_id ON hmw_questions(pov_statement_id);
CREATE INDEX idx_hmw_questions_priority ON hmw_questions(priority_score);

CREATE INDEX idx_brainstorm_sessions_hmw_id ON brainstorm_sessions(hmw_question_id);
CREATE INDEX idx_brainstorm_sessions_facilitator ON brainstorm_sessions(facilitator_id);

CREATE INDEX idx_ideas_session_id ON ideas(brainstorm_session_id);
CREATE INDEX idx_ideas_author_id ON ideas(author_id);
CREATE INDEX idx_ideas_votes ON ideas(votes);

CREATE INDEX idx_prototypes_idea_id ON prototypes(idea_id);
CREATE INDEX idx_prototypes_fidelity ON prototypes(fidelity);
CREATE INDEX idx_prototypes_status ON prototypes(status);

CREATE INDEX idx_test_sessions_prototype_id ON test_sessions(prototype_id);
CREATE INDEX idx_test_sessions_facilitator ON test_sessions(facilitator_id);
CREATE INDEX idx_test_sessions_test_date ON test_sessions(test_date);

CREATE INDEX idx_venture_hypotheses_business_plan_id ON venture_hypotheses(business_plan_id);
CREATE INDEX idx_venture_hypotheses_type ON venture_hypotheses(type);
CREATE INDEX idx_venture_hypotheses_status ON venture_hypotheses(status);
CREATE INDEX idx_venture_hypotheses_risk_level ON venture_hypotheses(risk_level);

CREATE INDEX idx_bml_cycles_project_id ON bml_cycles(project_id);
CREATE INDEX idx_bml_cycles_cycle_number ON bml_cycles(cycle_number);
CREATE INDEX idx_bml_cycles_validated ON bml_cycles(validated);

CREATE INDEX idx_design_sprints_project_id ON design_sprints(project_id);
CREATE INDEX idx_design_sprints_start_date ON design_sprints(start_date);
CREATE INDEX idx_design_sprints_facilitator ON design_sprints(facilitator_id);

CREATE INDEX idx_dt_readiness_user_id ON dt_readiness_assessments(user_id);
CREATE INDEX idx_dt_readiness_organization_id ON dt_readiness_assessments(organization_id);
CREATE INDEX idx_dt_readiness_overall ON dt_readiness_assessments(overall_readiness);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dt_projects_updated_at BEFORE UPDATE ON dt_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empathy_maps_updated_at BEFORE UPDATE ON empathy_maps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_journey_maps_updated_at BEFORE UPDATE ON user_journey_maps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pov_statements_updated_at BEFORE UPDATE ON pov_statements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hmw_questions_updated_at BEFORE UPDATE ON hmw_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brainstorm_sessions_updated_at BEFORE UPDATE ON brainstorm_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prototypes_updated_at BEFORE UPDATE ON prototypes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_sessions_updated_at BEFORE UPDATE ON test_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venture_hypotheses_updated_at BEFORE UPDATE ON venture_hypotheses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bml_cycles_updated_at BEFORE UPDATE ON bml_cycles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_design_sprints_updated_at BEFORE UPDATE ON design_sprints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dt_readiness_assessments_updated_at BEFORE UPDATE ON dt_readiness_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
