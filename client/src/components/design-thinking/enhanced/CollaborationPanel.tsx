import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Activity, 
  Clock, 
  MessageSquare,
  Video,
  Phone,
  MoreHorizontal,
  Wifi,
  WifiOff,
  Pause,
  Play,
  Square
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastActive: Date;
  status?: 'active' | 'idle' | 'away';
  currentActivity?: string;
}

interface CollaborationUpdate {
  id: string;
  type: 'participant_joined' | 'participant_left' | 'activity_completed' | 'deliverable_created' | 'phase_transition' | 'insight_generated';
  participant: string;
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface CollaborationPanelProps {
  participants: Participant[];
  updates: CollaborationUpdate[];
  onParticipantAction: (participantId: string, action: string) => void;
  className?: string;
}

export function CollaborationPanel({ 
  participants, 
  updates, 
  onParticipantAction, 
  className 
}: CollaborationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showUpdates, setShowUpdates] = useState(true);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filteredParticipants = participants.filter(participant => {
    if (filter === 'online') return participant.isOnline;
    if (filter === 'offline') return !participant.isOnline;
    return true;
  });

  const onlineCount = participants.filter(p => p.isOnline).length;
  const totalCount = participants.length;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'away':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'participant_joined':
        return <UserPlus className="w-4 h-4 text-green-600" />;
      case 'participant_left':
        return <UserMinus className="w-4 h-4 text-red-600" />;
      case 'activity_completed':
        return <Activity className="w-4 h-4 text-blue-600" />;
      case 'deliverable_created':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'phase_transition':
        return <Play className="w-4 h-4 text-orange-600" />;
      case 'insight_generated':
        return <Activity className="w-4 h-4 text-indigo-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getParticipantInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleParticipantAction = (participantId: string, action: string) => {
    onParticipantAction(participantId, action);
  };

  const handleUpdateAction = (updateId: string, action: string) => {
    // Handle update actions
    console.log('Update action:', updateId, action);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Collaboration
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{onlineCount}/{totalCount} online</span>
            <span>•</span>
            <span>{updates.length} updates</span>
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Participants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Participants</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter(filter === 'all' ? 'online' : 'all')}
                  className="h-6 px-2 text-xs"
                >
                  {filter === 'all' ? 'All' : 'Online'}
                </Button>
              </div>
            </div>

            <ScrollArea className="h-32">
              <div className="space-y-2">
                {filteredParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs">
                          {getParticipantInitials(participant.name)}
                        </AvatarFallback>
                      </Avatar>
                      {participant.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <div className={`w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {participant.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {participant.role}
                        </Badge>
                      </div>
                      {participant.currentActivity && (
                        <p className="text-xs text-gray-500 truncate">
                          {participant.currentActivity}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleParticipantAction(participant.id, 'message')}
                      >
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleParticipantAction(participant.id, 'call')}
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleParticipantAction(participant.id, 'video')}
                      >
                        <Video className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Recent Updates */}
          {showUpdates && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Activity</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpdates(!showUpdates)}
                  className="h-6 px-2 text-xs"
                >
                  {showUpdates ? 'Hide' : 'Show'}
                </Button>
              </div>

              <ScrollArea className="h-40">
                <div className="space-y-2">
                  {updates.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <Activity className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent activity</p>
                    </div>
                  ) : (
                    updates.slice(0, 10).map((update) => (
                      <div
                        key={update.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getUpdateIcon(update.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {update.participant}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(update.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {update.content}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleUpdateAction(update.id, 'more')}
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleParticipantAction('all', 'invite')}
                className="flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                Invite
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleParticipantAction('all', 'meeting')}
                className="flex items-center gap-1"
              >
                <Video className="w-3 h-3" />
                Meeting
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
