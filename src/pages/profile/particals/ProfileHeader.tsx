import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { PencilIcon, Save, X } from "lucide-react";

type UserProfileHeader = {
  firstName: string;
  lastName: string;
  title: string;
  description: string;
};

type Props = {
  user: UserProfileHeader;
  onSave?: (payload: Partial<UserProfileHeader>) => void;
};

export default function ProfileHeader({ user, onSave }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [title, setTitle] = useState(user.title);

  const handleCancel = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setTitle(user.title);
    setIsEdit(false);
  };

  const handleSave = () => {
    onSave?.({
      firstName,
      lastName,
      title,
    });

    setIsEdit(false);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 p-6 text-white">
      {isEdit ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Ad"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <Input
              label="Soyad"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <Input
            label="Ünvan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <p className="text-sm mt-3 max-w-xl">{user.description}</p>

          <div className="flex items-center justify-end gap-2">
            <Button onClick={handleCancel} className="max-w-fit bg-transparent">
              <X size={18} />
            </Button>

            <Button onClick={handleSave} className="max-w-fit bg-transparent">
              <Save size={18} />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold">
            {user.firstName} {user.lastName}
          </h1>

          <p className="mt-1 text-blue-300">{user.title}</p>

          <p className="mt-3 max-w-xl text-sm">{user.description}</p>

          <div className="flex items-center justify-end ">
            <Button onClick={() => setIsEdit(true)} className="max-w-fit bg-transparent">
              <PencilIcon size={18} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}