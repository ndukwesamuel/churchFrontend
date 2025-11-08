import { Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFetchData, useMutateData } from "../../../hook/Request";
import { useEffect, useState } from "react";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const groupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

export default function GroupSettingsContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  // Fetch groups
  const { data, refetch } = useFetchData("/api/v1/groups", "getGroups");
  console.log({
    rty: data?.data?.groups,
  });

  const groups = data?.data?.groups || [];

  // Create/Update mutation
  const { mutateAsync: createOrUpdate, isLoading } = useMutateData(
    editingGroup ? "updateGroup" : "createGroup",
    editingGroup ? "PATCH" : "POST"
  );

  // Delete mutation
  const { mutateAsync: deleteGroup, isLoading: isDeleting } = useMutateData(
    "deleteGroup",
    "DELETE"
  );

  const form = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when editing a group
  useEffect(() => {
    if (editingGroup) {
      form.reset({
        name: editingGroup.name || "",
        description: editingGroup.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [editingGroup, form]);

  const onSubmit = async (payload) => {
    try {
      const url = editingGroup
        ? `/api/v1/setting/group/${editingGroup.id}`
        : "/api/v1/setting/group";

      const response = await createOrUpdate({
        url,
        data: payload,
      });

      toast.success(response.message || "Group saved successfully");
      setIsDialogOpen(false);
      setEditingGroup(null);
      form.reset();
      refetch();
    } catch (error) {
      toast.error(
        error.errors?.map((err) => err.message)?.join(", ") ||
          error?.message ||
          "Failed to save group."
      );
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      const response = await deleteGroup({
        url: `/api/v1/setting/group/${groupId}`,
      });
      toast.success(response.message || "Group deleted successfully");
      refetch();
    } catch (error) {
      toast.error(
        error.errors?.map((err) => err.message)?.join(", ") ||
          error?.message ||
          "Failed to delete group."
      );
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingGroup(null);
    form.reset();
  };

  return (
    <div className="space-y-6 bg-gray-50 p-4 rounded-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Group Settings</h3>
            <p className="text-sm text-gray-500">
              Manage your church groups and their descriptions
            </p>
          </div>
        </div>

        {/* Add Group Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingGroup(null);
                form.reset();
              }}
              className="bg-[#5B38DB] hover:bg-[#4A2FB8] rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? "Edit Group" : "Create New Group"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Group Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Youth, Men, Women"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the purpose of this group"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#5B38DB] hover:bg-[#4A2FB8]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex gap-2 items-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </div>
                    ) : editingGroup ? (
                      "Update Group"
                    ) : (
                      "Create Group"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No groups yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first group to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {group.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {group.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(group)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(group.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
