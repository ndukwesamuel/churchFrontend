import Button from "../../../components/Button";
import { Plus, File as FileIcon, Folder as FolderIcon } from "lucide-react";
const EmptyState = ({ onCreateCollection, isCreating }) => (
  <div className="text-center py-12">
    <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-4 flex items-center justify-center">
      <FileIcon className="w-6 h-6 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
    <p className="text-gray-600 mb-4">Upload some files to get started</p>
    <Button onClick={onCreateCollection} disabled={isCreating}>
      {isCreating ? (
        <>
          <Loader className="w-5 h-5 animate-spin mr-2" />
          Creating Collection...
        </>
      ) : (
        <>
          <Plus className="w-5 h-5 mr-2" />
          Create Collection
        </>
      )}
    </Button>
  </div>
);

export default EmptyState;
