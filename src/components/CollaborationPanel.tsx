import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MessageCircle, 
  Video, 
  Share, 
  UserPlus,
  Send,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Phone,
  PhoneOff
} from "lucide-react";

interface CollaborationPanelProps {
  scans: any[];
}

export const CollaborationPanel = ({ scans }: CollaborationPanelProps) => {
  const [message, setMessage] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const collaborators = [
    {
      id: "1",
      name: "Dr. Sarah Chen",
      role: "Radiologist",
      status: "online",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "2", 
      name: "Dr. Michael Rodriguez",
      role: "Cardiologist",
      status: "busy",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "3",
      name: "Dr. Emily Watson",
      role: "Neurologist", 
      status: "away",
      avatar: "https://images.unsplash.com/photo-1594824475317-d3c0b8e8b6b5?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const annotations = [
    {
      id: "1",
      radiologist: "Dr. Sarah Chen",
      comment: "Possible consolidation in right lower lobe. Recommend follow-up CT.",
      timestamp: "2024-01-15 14:30",
      scanId: "1"
    },
    {
      id: "2",
      radiologist: "Dr. Michael Rodriguez", 
      comment: "Cardiac silhouette appears enlarged. Consider echocardiogram.",
      timestamp: "2024-01-15 14:25",
      scanId: "1"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-400";
      case "busy": return "bg-red-400";
      case "away": return "bg-yellow-400";
      default: return "bg-gray-400";
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message via WebSocket
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    // In a real app, this would initiate WebRTC connection
  };

  const endVideoCall = () => {
    setIsVideoCall(false);
    setIsMuted(false);
    setIsCameraOn(true);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Active Collaborators */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Active Team</span>
            </div>
            <Button variant="ghost" size="sm">
              <UserPlus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between p-3 rounded-lg bg-card/30">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={collaborator.avatar} />
                    <AvatarFallback>{collaborator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(collaborator.status)}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{collaborator.name}</p>
                  <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={startVideoCall}>
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Video Call / Chat */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isVideoCall ? (
                <>
                  <Video className="w-5 h-5 text-cyan-400" />
                  <span>Video Conference</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  <span>Team Chat</span>
                </>
              )}
            </div>
            {isVideoCall && (
              <Button variant="destructive" size="sm" onClick={endVideoCall}>
                <PhoneOff className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isVideoCall ? (
            <div className="space-y-4">
              {/* Video Call Interface */}
              <div className="aspect-video bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-400/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Video className="w-12 h-12 text-cyan-400 mx-auto" />
                    <p className="text-white font-medium">Dr. Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant={isCameraOn ? "secondary" : "destructive"}
                    size="sm"
                    onClick={() => setIsCameraOn(!isCameraOn)}
                  >
                    {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={endVideoCall}>
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto space-y-3 p-3 bg-card/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Dr. Sarah Chen • 2:30 PM</p>
                    <p className="text-sm">Looking at the chest X-ray for PT-2024-001. The opacity in the right lower lobe is concerning.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">MR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Dr. Michael Rodriguez • 2:32 PM</p>
                    <p className="text-sm">Agreed. Also noting the cardiac silhouette enlargement. Should we order an echo?</p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Annotations */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share className="w-5 h-5 text-cyan-400" />
            <span>Annotations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {annotations.map((annotation) => (
            <div key={annotation.id} className="p-4 rounded-lg bg-card/30 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  Scan #{annotation.scanId}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {annotation.timestamp}
                </span>
              </div>
              <p className="text-sm mb-2">{annotation.comment}</p>
              <p className="text-xs text-cyan-400">— {annotation.radiologist}</p>
            </div>
          ))}
          
          <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600">
            Add Annotation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};