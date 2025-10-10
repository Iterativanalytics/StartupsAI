"use strict";
/**
 * RIASEC to Startup Role Mapping
 * Maps Holland codes to optimal startup roles
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStartupRoles = getStartupRoles;
exports.getRoleDescription = getRoleDescription;
exports.getComplementaryRoles = getComplementaryRoles;
const riasec_model_1 = require("../../models/riasec.model");
/**
 * Comprehensive mapping of RIASEC codes to startup roles
 */
const ROLE_MAPPINGS = [
    // EIA - Visionary Founder
    {
        code: 'EIA',
        roles: [riasec_model_1.StartupRole.VISIONARY_FOUNDER, riasec_model_1.StartupRole.CREATIVE_DIRECTOR],
        description: 'Bold visionary who combines leadership with innovation',
        strengths: ['Strategic vision', 'Innovation', 'Persuasion', 'Creativity'],
        challenges: ['Execution details', 'Process management', 'Operational discipline']
    },
    // EIS - Growth Strategist / Business Developer
    {
        code: 'EIS',
        roles: [riasec_model_1.StartupRole.GROWTH_STRATEGIST, riasec_model_1.StartupRole.BUSINESS_DEVELOPER],
        description: 'Strategic leader who excels at growth and partnerships',
        strengths: ['Strategic thinking', 'Relationship building', 'Data-driven decisions', 'Networking'],
        challenges: ['Technical depth', 'Creative innovation', 'Hands-on execution']
    },
    // IRA - Technical Founder / Product Builder
    {
        code: 'IRA',
        roles: [riasec_model_1.StartupRole.TECHNICAL_FOUNDER, riasec_model_1.StartupRole.PRODUCT_BUILDER],
        description: 'Technical innovator who builds breakthrough products',
        strengths: ['Technical expertise', 'Problem-solving', 'Innovation', 'Hands-on building'],
        challenges: ['Sales and marketing', 'Team management', 'Business development']
    },
    // AES - Creative Director / Community Builder
    {
        code: 'AES',
        roles: [riasec_model_1.StartupRole.CREATIVE_DIRECTOR, riasec_model_1.StartupRole.COMMUNITY_BUILDER],
        description: 'Creative leader who builds engaged communities',
        strengths: ['Brand building', 'Community engagement', 'Creative vision', 'People skills'],
        challenges: ['Technical implementation', 'Financial management', 'Operational systems']
    },
    // CER - Operations Lead
    {
        code: 'CER',
        roles: [riasec_model_1.StartupRole.OPERATIONS_LEAD],
        description: 'Operational excellence leader who scales efficiently',
        strengths: ['Process optimization', 'Execution', 'Financial discipline', 'Systems thinking'],
        challenges: ['Disruptive innovation', 'Creative thinking', 'Ambiguity tolerance']
    },
    // IAS - Product Builder (User-Centric)
    {
        code: 'IAS',
        roles: [riasec_model_1.StartupRole.PRODUCT_BUILDER, riasec_model_1.StartupRole.DATA_SCIENTIST],
        description: 'Analytical innovator with strong user empathy',
        strengths: ['User research', 'Data analysis', 'Product design', 'Innovation'],
        challenges: ['Sales and pitching', 'Rapid execution', 'Leadership']
    },
    // SEA - People Leader / Community Builder
    {
        code: 'SEA',
        roles: [riasec_model_1.StartupRole.PEOPLE_LEADER, riasec_model_1.StartupRole.COMMUNITY_BUILDER],
        description: 'People-focused leader who builds strong cultures',
        strengths: ['Team building', 'Culture development', 'Networking', 'Creative thinking'],
        challenges: ['Technical depth', 'Financial management', 'Hard decisions']
    },
    // ICR - Data Scientist / Technical Founder
    {
        code: 'ICR',
        roles: [riasec_model_1.StartupRole.DATA_SCIENTIST, riasec_model_1.StartupRole.TECHNICAL_FOUNDER],
        description: 'Technical analyst who excels at data-driven solutions',
        strengths: ['Data analysis', 'Technical skills', 'Systematic thinking', 'Quality focus'],
        challenges: ['Innovation', 'People management', 'Sales and marketing']
    },
    // EAI - Visionary Founder (Innovation-focused)
    {
        code: 'EAI',
        roles: [riasec_model_1.StartupRole.VISIONARY_FOUNDER],
        description: 'Charismatic innovator who sees the future',
        strengths: ['Vision', 'Innovation', 'Persuasion', 'Strategic thinking'],
        challenges: ['Execution', 'Process', 'Details', 'Patience with incremental progress']
    },
    // ESC - Business Developer / Operations
    {
        code: 'ESC',
        roles: [riasec_model_1.StartupRole.BUSINESS_DEVELOPER, riasec_model_1.StartupRole.OPERATIONS_LEAD],
        description: 'Relationship-driven leader with operational skills',
        strengths: ['Partnership building', 'Process management', 'Team coordination', 'Execution'],
        challenges: ['Deep technical work', 'Disruptive innovation', 'R&D']
    }
];
/**
 * Get startup roles based on RIASEC code and scores
 */
function getStartupRoles(code, scores) {
    // Find exact code match
    const exactMatch = ROLE_MAPPINGS.find(mapping => mapping.code === code);
    if (exactMatch) {
        return exactMatch.roles;
    }
    // Find partial matches (any 2 of 3 letters match)
    const partialMatches = ROLE_MAPPINGS.filter(mapping => {
        const matchCount = code.split('').filter(char => mapping.code.includes(char)).length;
        return matchCount >= 2;
    });
    if (partialMatches.length > 0) {
        // Return roles from best partial match
        return partialMatches[0].roles;
    }
    // Fallback: infer roles from individual high scores
    return inferRolesFromScores(scores);
}
/**
 * Infer roles based on individual dimension scores
 */
function inferRolesFromScores(scores) {
    const roles = [];
    // Check dominant dimensions (> 70)
    if (scores.E > 70 && scores.I > 60) {
        roles.push(riasec_model_1.StartupRole.GROWTH_STRATEGIST);
    }
    else if (scores.E > 70 && scores.A > 60) {
        roles.push(riasec_model_1.StartupRole.VISIONARY_FOUNDER);
    }
    else if (scores.E > 70 && scores.S > 60) {
        roles.push(riasec_model_1.StartupRole.BUSINESS_DEVELOPER);
    }
    else if (scores.E > 70) {
        roles.push(riasec_model_1.StartupRole.GROWTH_STRATEGIST);
    }
    if (scores.I > 70 && scores.R > 60) {
        roles.push(riasec_model_1.StartupRole.TECHNICAL_FOUNDER);
    }
    else if (scores.I > 70 && scores.A > 60) {
        roles.push(riasec_model_1.StartupRole.PRODUCT_BUILDER);
    }
    else if (scores.I > 70 && scores.C > 60) {
        roles.push(riasec_model_1.StartupRole.DATA_SCIENTIST);
    }
    if (scores.A > 70 && scores.S > 60) {
        roles.push(riasec_model_1.StartupRole.CREATIVE_DIRECTOR);
    }
    else if (scores.A > 70) {
        roles.push(riasec_model_1.StartupRole.PRODUCT_BUILDER);
    }
    if (scores.S > 70 && scores.E > 60) {
        roles.push(riasec_model_1.StartupRole.PEOPLE_LEADER);
    }
    else if (scores.S > 70 && scores.A > 60) {
        roles.push(riasec_model_1.StartupRole.COMMUNITY_BUILDER);
    }
    if (scores.C > 70 && scores.E > 60) {
        roles.push(riasec_model_1.StartupRole.OPERATIONS_LEAD);
    }
    if (scores.R > 70 && scores.I > 60) {
        roles.push(riasec_model_1.StartupRole.TECHNICAL_FOUNDER);
    }
    // If no roles identified, default based on highest score
    if (roles.length === 0) {
        const highestCategory = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])[0][0];
        const defaultRoles = {
            E: riasec_model_1.StartupRole.GROWTH_STRATEGIST,
            I: riasec_model_1.StartupRole.PRODUCT_BUILDER,
            A: riasec_model_1.StartupRole.CREATIVE_DIRECTOR,
            S: riasec_model_1.StartupRole.PEOPLE_LEADER,
            C: riasec_model_1.StartupRole.OPERATIONS_LEAD,
            R: riasec_model_1.StartupRole.TECHNICAL_FOUNDER
        };
        roles.push(defaultRoles[highestCategory]);
    }
    return roles;
}
/**
 * Get role description
 */
function getRoleDescription(role) {
    const descriptions = {
        [riasec_model_1.StartupRole.VISIONARY_FOUNDER]: 'Sets bold vision and drives innovation. Natural leader who inspires teams and investors with compelling future vision.',
        [riasec_model_1.StartupRole.TECHNICAL_FOUNDER]: 'Deep technical expertise, builds core product. Combines technical skills with problem-solving to create breakthrough solutions.',
        [riasec_model_1.StartupRole.GROWTH_STRATEGIST]: 'Drives growth through strategic initiatives. Data-driven leader who identifies opportunities and executes growth plans.',
        [riasec_model_1.StartupRole.PRODUCT_BUILDER]: 'Creates innovative products users love. Combines creativity, technical skills, and user empathy to build great products.',
        [riasec_model_1.StartupRole.PEOPLE_LEADER]: 'Builds high-performing teams and culture. Exceptional at recruiting, developing, and retaining top talent.',
        [riasec_model_1.StartupRole.OPERATIONS_LEAD]: 'Scales operations efficiently. Creates systems and processes that enable rapid, sustainable growth.',
        [riasec_model_1.StartupRole.CREATIVE_DIRECTOR]: 'Drives brand and creative vision. Builds distinctive brand identity and creates memorable user experiences.',
        [riasec_model_1.StartupRole.BUSINESS_DEVELOPER]: 'Builds strategic partnerships and drives revenue. Excellent networker who creates win-win partnerships.',
        [riasec_model_1.StartupRole.DATA_SCIENTIST]: 'Leverages data for insights and decisions. Analytical expert who turns data into competitive advantage.',
        [riasec_model_1.StartupRole.COMMUNITY_BUILDER]: 'Builds engaged user communities. Creates passionate communities that drive growth through word-of-mouth.'
    };
    return descriptions[role] || 'Startup leader';
}
/**
 * Get recommended co-founder roles based on primary role
 */
function getComplementaryRoles(primaryRoles) {
    const complementary = [];
    primaryRoles.forEach(role => {
        switch (role) {
            case riasec_model_1.StartupRole.VISIONARY_FOUNDER:
                complementary.push(riasec_model_1.StartupRole.OPERATIONS_LEAD, riasec_model_1.StartupRole.TECHNICAL_FOUNDER);
                break;
            case riasec_model_1.StartupRole.TECHNICAL_FOUNDER:
                complementary.push(riasec_model_1.StartupRole.BUSINESS_DEVELOPER, riasec_model_1.StartupRole.PEOPLE_LEADER);
                break;
            case riasec_model_1.StartupRole.CREATIVE_DIRECTOR:
                complementary.push(riasec_model_1.StartupRole.OPERATIONS_LEAD, riasec_model_1.StartupRole.DATA_SCIENTIST);
                break;
            case riasec_model_1.StartupRole.OPERATIONS_LEAD:
                complementary.push(riasec_model_1.StartupRole.VISIONARY_FOUNDER, riasec_model_1.StartupRole.CREATIVE_DIRECTOR);
                break;
            case riasec_model_1.StartupRole.PEOPLE_LEADER:
                complementary.push(riasec_model_1.StartupRole.TECHNICAL_FOUNDER, riasec_model_1.StartupRole.DATA_SCIENTIST);
                break;
            case riasec_model_1.StartupRole.GROWTH_STRATEGIST:
                complementary.push(riasec_model_1.StartupRole.PRODUCT_BUILDER, riasec_model_1.StartupRole.TECHNICAL_FOUNDER);
                break;
            default:
                complementary.push(riasec_model_1.StartupRole.OPERATIONS_LEAD, riasec_model_1.StartupRole.BUSINESS_DEVELOPER);
        }
    });
    // Remove duplicates
    return Array.from(new Set(complementary));
}
