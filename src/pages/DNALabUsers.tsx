import React, { useState } from 'react';
import { AdminRoute } from '@/features/admin/components/AdminRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Filter,
  MoreHorizontal,
  Ban,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockUsers = [
  {
    id: '1',
    username: 'creator_alpha',
    email: 'alpha@example.com',
    status: 'active',
    role: 'creator',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    cardsCreated: 127,
    totalEarnings: '$2,450'
  },
  {
    id: '2',
    username: 'collector_beta',
    email: 'beta@example.com',
    status: 'pending',
    role: 'user',
    joinDate: '2024-02-20',
    lastActive: '1 day ago',
    cardsCreated: 3,
    totalEarnings: '$0'
  },
  {
    id: '3',
    username: 'artist_gamma',
    email: 'gamma@example.com',
    status: 'suspended',
    role: 'creator',
    joinDate: '2023-12-01',
    lastActive: '1 week ago',
    cardsCreated: 89,
    totalEarnings: '$1,890'
  }
];

const StatusBadge = ({ status }) => {
  const variants = {
    active: { variant: 'default', icon: CheckCircle, color: 'text-green-400' },
    pending: { variant: 'secondary', icon: Clock, color: 'text-yellow-400' },
    suspended: { variant: 'destructive', icon: Ban, color: 'text-red-400' }
  };
  
  const config = variants[status] || variants.active;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {status}
    </Badge>
  );
};

export default function DNALabUsers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminRoute requiredPermission="user_management">
      <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-purple-900/10 to-blue-900/10">
        {/* Header */}
        <div className="border-b border-crd-blue/20 bg-crd-darkest/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/dna/lab/dashboard')}
                  className="text-crd-lightGray hover:text-crd-lightText"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    👥 User Management
                  </h1>
                  <p className="text-crd-mutedText">Manage user accounts, roles, and permissions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="border-crd-blue/30">
                  Export Users
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                  Add User
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-mutedText">Total Users</p>
                  <p className="text-2xl font-bold text-crd-lightText">47,392</p>
                  <p className="text-xs text-green-400 mt-1">+8.3% this month</p>
                </div>
                <Users className="h-8 w-8 text-crd-blue/60" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-mutedText">Active Users</p>
                  <p className="text-2xl font-bold text-crd-lightText">42,109</p>
                  <p className="text-xs text-green-400 mt-1">88.9% of total</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400/60" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-mutedText">Pending</p>
                  <p className="text-2xl font-bold text-crd-lightText">1,283</p>
                  <p className="text-xs text-yellow-400 mt-1">Awaiting verification</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400/60" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-mutedText">Suspended</p>
                  <p className="text-2xl font-bold text-crd-lightText">127</p>
                  <p className="text-xs text-red-400 mt-1">0.3% of total</p>
                </div>
                <Ban className="h-8 w-8 text-red-400/60" />
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-crd-mutedText" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-crd-darkest border-crd-blue/30 focus:border-crd-blue w-80"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-crd-darkest border border-crd-blue/30 rounded-md text-crd-lightText focus:border-crd-blue focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-crd-blue/30">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
                <Button variant="outline" size="sm" className="border-crd-blue/30">
                  Bulk Actions
                </Button>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-crd-lightText mb-4">
                Users ({filteredUsers.length})
              </h3>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-crd-blue/20">
                      <TableHead className="text-crd-lightGray">User</TableHead>
                      <TableHead className="text-crd-lightGray">Status</TableHead>
                      <TableHead className="text-crd-lightGray">Role</TableHead>
                      <TableHead className="text-crd-lightGray">Join Date</TableHead>
                      <TableHead className="text-crd-lightGray">Last Active</TableHead>
                      <TableHead className="text-crd-lightGray">Cards</TableHead>
                      <TableHead className="text-crd-lightGray">Earnings</TableHead>
                      <TableHead className="text-crd-lightGray">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-crd-blue/10 hover:bg-crd-darkest/50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-crd-lightText">{user.username}</p>
                            <p className="text-sm text-crd-mutedText">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-crd-lightGray">{user.joinDate}</TableCell>
                        <TableCell className="text-crd-lightGray">{user.lastActive}</TableCell>
                        <TableCell className="text-crd-lightGray">{user.cardsCreated}</TableCell>
                        <TableCell className="text-crd-lightGray">{user.totalEarnings}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminRoute>
  );
}