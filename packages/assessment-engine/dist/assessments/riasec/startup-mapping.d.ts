/**
 * RIASEC to Startup Role Mapping
 * Maps Holland codes to optimal startup roles
 */
import { StartupRole, RIASECScores } from '../../models/riasec.model';
/**
 * Get startup roles based on RIASEC code and scores
 */
export declare function getStartupRoles(code: string, scores: RIASECScores): StartupRole[];
/**
 * Get role description
 */
export declare function getRoleDescription(role: StartupRole): string;
/**
 * Get recommended co-founder roles based on primary role
 */
export declare function getComplementaryRoles(primaryRoles: StartupRole[]): StartupRole[];
