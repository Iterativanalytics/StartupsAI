// Collaboration-specific types for document system

export interface CollaborationEngine {
  joinDocument(documentId: string, userId: string): Promise<void>;
  leaveDocument(documentId: string, userId: string): Promise<void>;
  updateCursor(documentId: string, userId: string, position: CursorPosition): Promise<void>;
  addComment(documentId: string, comment: Comment): Promise<void>;
  updateComment(documentId: string, commentId: string, updates: Partial<Comment>): Promise<void>;
  deleteComment(documentId: string, commentId: string): Promise<void>;
  addSuggestion(documentId: string, suggestion: Suggestion): Promise<void>;
  acceptSuggestion(documentId: string, suggestionId: string, userId: string): Promise<void>;
  rejectSuggestion(documentId: string, suggestionId: string, userId: string): Promise<void>;
  addMention(documentId: string, mention: Mention): Promise<void>;
  markMentionRead(documentId: string, mentionId: string, userId: string): Promise<void>;
  getActiveUsers(documentId: string): Promise<ActiveUser[]>;
  getComments(documentId: string): Promise<Comment[]>;
  getSuggestions(documentId: string): Promise<Suggestion[]>;
  getMentions(documentId: string, userId: string): Promise<Mention[]>;
}

export interface PresenceManager {
  updatePresence(userId: string, documentId: string, status: PresenceStatus): Promise<void>;
  getPresence(documentId: string): Promise<PresenceMap>;
  subscribeToPresence(documentId: string, callback: PresenceCallback): Promise<void>;
  unsubscribeFromPresence(documentId: string, callback: PresenceCallback): Promise<void>;
}

export interface CommentSystem {
  addComment(comment: Comment): Promise<void>;
  updateComment(commentId: string, updates: Partial<Comment>): Promise<void>;
  deleteComment(commentId: string): Promise<void>;
  resolveComment(commentId: string, userId: string): Promise<void>;
  addReply(commentId: string, reply: CommentReply): Promise<void>;
  getComments(documentId: string, sectionId?: string): Promise<Comment[]>;
  subscribeToComments(documentId: string, callback: CommentCallback): Promise<void>;
  unsubscribeFromComments(documentId: string, callback: CommentCallback): Promise<void>;
}

export interface NotificationService {
  sendNotification(notification: Notification): Promise<void>;
  getNotifications(userId: string, limit?: number, offset?: number): Promise<Notification[]>;
  markNotificationRead(notificationId: string, userId: string): Promise<void>;
  markAllNotificationsRead(userId: string): Promise<void>;
  subscribeToNotifications(userId: string, callback: NotificationCallback): Promise<void>;
  unsubscribeFromNotifications(userId: string, callback: NotificationCallback): Promise<void>;
}

export interface ActivityTracker {
  trackActivity(activity: Activity): Promise<void>;
  getActivities(documentId: string, limit?: number, offset?: number): Promise<Activity[]>;
  getUserActivities(userId: string, limit?: number, offset?: number): Promise<Activity[]>;
  subscribeToActivities(documentId: string, callback: ActivityCallback): Promise<void>;
  unsubscribeFromActivities(documentId: string, callback: ActivityCallback): Promise<void>;
}

// Core collaboration types
export interface ActiveUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  cursor?: CursorPosition;
  lastSeen: Date;
  permissions: string[];
  status: PresenceStatus;
}

export interface CursorPosition {
  sectionId: string;
  offset: number;
  timestamp: Date;
  selection?: TextSelection;
}

export interface TextSelection {
  start: number;
  end: number;
  text: string;
}

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

export interface PresenceMap {
  [userId: string]: {
    status: PresenceStatus;
    lastSeen: Date;
    cursor?: CursorPosition;
  };
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  sectionId?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  replies: CommentReply[];
  mentions: string[];
  attachments: string[];
  reactions: Reaction[];
}

export interface CommentReply {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  mentions: string[];
  reactions: Reaction[];
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Suggestion {
  id: string;
  type: 'insert' | 'delete' | 'replace';
  content: string;
  author: string;
  timestamp: Date;
  sectionId: string;
  accepted: boolean;
  acceptedBy?: string;
  acceptedAt?: Date;
  originalContent?: string;
  position: number;
  length: number;
}

export interface Mention {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  documentId: string;
  sectionId?: string;
  commentId?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  documentId?: string;
  read: boolean;
  timestamp: Date;
  data?: any;
  actions?: NotificationAction[];
}

export type NotificationType = 
  | 'comment' 
  | 'mention' 
  | 'suggestion' 
  | 'approval' 
  | 'rejection' 
  | 'invitation' 
  | 'reminder' 
  | 'system';

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'danger';
}

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  documentId: string;
  timestamp: Date;
  description: string;
  data?: any;
  metadata?: ActivityMetadata;
}

export type ActivityType = 
  | 'created' 
  | 'updated' 
  | 'deleted' 
  | 'shared' 
  | 'commented' 
  | 'suggested' 
  | 'approved' 
  | 'rejected' 
  | 'viewed' 
  | 'downloaded'
  | 'join'
  | 'leave'
  | 'comment_updated'
  | 'comment_deleted'
  | 'suggestion_accepted'
  | 'suggestion_rejected'
  | 'mentioned';

export interface ActivityMetadata {
  sectionId?: string;
  commentId?: string;
  suggestionId?: string;
  changes?: ChangeSet[];
  duration?: number;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  mentionId?: string;
}

export interface ChangeSet {
  type: 'add' | 'modify' | 'delete';
  path: string;
  oldValue?: any;
  newValue?: any;
  description?: string;
}

// Callback types
export type PresenceCallback = (presence: PresenceMap) => void;
export type CommentCallback = (comments: Comment[]) => void;
export type NotificationCallback = (notification: Notification) => void;
export type ActivityCallback = (activity: Activity) => void;

// Collaboration settings
export interface CollaborationSettings {
  allowComments: boolean;
  allowSuggestions: boolean;
  allowMentions: boolean;
  allowReactions: boolean;
  requireApproval: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  conflictResolution: 'last-writer-wins' | 'merge' | 'manual';
  notifications: NotificationSettings;
  permissions: PermissionSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  types: NotificationType[];
}

export interface PermissionSettings {
  canEdit: string[];
  canComment: string[];
  canView: string[];
  canShare: string[];
  canDelete: string[];
  canApprove: string[];
}

// Real-time collaboration
export interface CollaborationSession {
  id: string;
  documentId: string;
  userId: string;
  joinedAt: Date;
  lastActivity: Date;
  cursor?: CursorPosition;
  permissions: string[];
}

export interface CollaborationEvent {
  type: 'join' | 'leave' | 'cursor' | 'comment' | 'suggestion' | 'mention' | 'activity';
  documentId: string;
  userId: string;
  timestamp: Date;
  data: any;
}

export interface CollaborationState {
  activeUsers: ActiveUser[];
  comments: Comment[];
  suggestions: Suggestion[];
  mentions: Mention[];
  lastActivity: Date;
  session: CollaborationSession;
}

// Conflict resolution
export interface ConflictResolution {
  type: 'content' | 'metadata' | 'permissions';
  documentId: string;
  conflicts: Conflict[];
  resolution: ConflictResolutionStrategy;
  resolvedBy: string;
  resolvedAt: Date;
}

export interface Conflict {
  field: string;
  localValue: any;
  remoteValue: any;
  timestamp: Date;
  userId: string;
}

export type ConflictResolutionStrategy = 
  | 'local-wins' 
  | 'remote-wins' 
  | 'merge' 
  | 'manual' 
  | 'last-writer-wins';

// Collaboration analytics
export interface CollaborationAnalytics {
  totalUsers: number;
  activeUsers: number;
  comments: number;
  suggestions: number;
  mentions: number;
  activities: number;
  averageSessionTime: number;
  mostActiveUsers: UserActivity[];
  collaborationScore: number;
  lastActivity: Date;
}

export interface UserActivity {
  userId: string;
  name: string;
  activities: number;
  comments: number;
  suggestions: number;
  timeSpent: number;
  lastActivity: Date;
}
