// pages/Event/GroupsPanel.jsx
import React, { useState } from "react";
import { Plus, Trash2, Pencil, Check, X, Users } from "lucide-react";
import { useMutateData, usePatchData, useDeleteData } from "../../hook/Request";
import { toast } from "sonner";

const GroupsPanel = ({ eventId, groups, loadingGroups, refetchGroups }) => {
  const [groupCount, setGroupCount] = useState(2);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const { mutate: createGroups, isLoading: creatingGroups } =
    useMutateData("event-groups");
  const { mutate: createGroup, isLoading: creatingGroup } =
    useMutateData("event-groups");
  const { mutate: renameGroup } = usePatchData("event-groups");
  const { mutate: deleteGroup } = useDeleteData("event-groups");

  const handleCreateGroups = () => {
    const count = Number(groupCount);
    if (!count || count < 1) {
      toast.error("Enter a number of groups to create");
      return;
    }
    createGroups(
      { url: `/api/v1/event/${eventId}/groups/bulk`, data: { count } },
      {
        onSuccess: (response) => {
          toast.success(response?.message || "Groups created");
          refetchGroups();
        },
        onError: (error) => toast.error(error?.message || "Failed to create groups"),
      },
    );
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("Enter a group name");
      return;
    }
    createGroup(
      { url: `/api/v1/event/${eventId}/groups`, data: { name: newGroupName.trim() } },
      {
        onSuccess: () => {
          toast.success("Group created");
          setNewGroupName("");
          refetchGroups();
        },
        onError: (error) => toast.error(error?.message || "Failed to create group"),
      },
    );
  };

  const startEditing = (group) => {
    setEditingGroupId(group._id);
    setEditingName(group.name);
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setEditingName("");
  };

  const handleRenameGroup = (groupId) => {
    if (!editingName.trim()) {
      toast.error("Group name can't be empty");
      return;
    }
    renameGroup(
      { url: `/api/v1/event/groups/${groupId}`, data: { name: editingName.trim() } },
      {
        onSuccess: () => {
          toast.success("Group renamed");
          cancelEditing();
          refetchGroups();
        },
        onError: (error) => toast.error(error?.message || "Failed to rename group"),
      },
    );
  };

  const handleDeleteGroup = (group) => {
    if (
      !window.confirm(
        `Delete "${group.name}"? Its ${group.memberCount || 0} member(s) will become unassigned.`,
      )
    ) {
      return;
    }
    deleteGroup(
      { url: `/api/v1/event/groups/${group._id}` },
      {
        onSuccess: () => {
          toast.success("Group deleted");
          refetchGroups();
        },
        onError: (error) => toast.error(error?.message || "Failed to delete group"),
      },
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold">Groups</h3>
      </div>

      {/* Create groups */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={groupCount}
            onChange={(e) => setGroupCount(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleCreateGroups}
            disabled={creatingGroups}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Create Groups
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Custom group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleCreateGroup}
            disabled={creatingGroup}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Groups list */}
      {loadingGroups ? (
        <p className="text-sm text-gray-500">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-gray-500">
          No groups yet. Create some above, then assign registrants to them
          from the table below.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <div
              key={group._id}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg"
            >
              {editingGroupId === group._id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className="w-32 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <button
                    onClick={() => handleRenameGroup(group._id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-gray-900">
                    {group.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {group.memberCount || 0} member(s)
                  </span>
                  <button
                    onClick={() => startEditing(group)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsPanel;
