// Agent Type Definitions
export var AgentType;
(function (AgentType) {
    // Primary Co-Agents (Deep Partnership)
    AgentType["CO_FOUNDER"] = "co_founder";
    AgentType["CO_INVESTOR"] = "co_investor";
    AgentType["CO_BUILDER"] = "co_builder";
    // Specialized Functional Agents
    AgentType["BUSINESS_ADVISOR"] = "business_advisor";
    AgentType["INVESTMENT_ANALYST"] = "investment_analyst";
    AgentType["CREDIT_ANALYST"] = "credit_analyst";
    AgentType["IMPACT_ANALYST"] = "impact_analyst";
    AgentType["PROGRAM_MANAGER"] = "program_manager";
    AgentType["PLATFORM_ORCHESTRATOR"] = "platform_orchestrator";
})(AgentType || (AgentType = {}));
// Query Types for Intelligent Routing
export var QueryType;
(function (QueryType) {
    QueryType["STRATEGIC"] = "strategic";
    QueryType["ACCOUNTABILITY"] = "accountability";
    QueryType["EMOTIONAL"] = "emotional";
    QueryType["RELATIONSHIP"] = "relationship";
    QueryType["BRAINSTORM"] = "brainstorm";
    QueryType["ANALYSIS"] = "analysis";
    QueryType["RESEARCH"] = "research";
    QueryType["DOCUMENT"] = "document";
    QueryType["TECHNICAL"] = "technical";
    QueryType["REPORTING"] = "reporting";
    QueryType["GENERAL"] = "general";
})(QueryType || (QueryType = {}));
// Agent Tier Classification
export var AgentTier;
(function (AgentTier) {
    AgentTier["CO_AGENT"] = "co_agent";
    AgentTier["FUNCTIONAL"] = "functional"; // Task layer
})(AgentTier || (AgentTier = {}));
export var UserType;
(function (UserType) {
    UserType["ENTREPRENEUR"] = "entrepreneur";
    UserType["INVESTOR"] = "investor";
    UserType["LENDER"] = "lender";
    UserType["GRANTOR"] = "grantor";
    UserType["PARTNER"] = "partner";
    UserType["ADMIN"] = "admin";
})(UserType || (UserType = {}));
