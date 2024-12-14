import { useAuth } from '../store/useAuth.store.ts';
import { useUser } from '../store/useUser.store.ts';
import { Camera, Loader2, Mail, User } from 'lucide-react';
import { useState } from 'react';

const Profile = () => {
  const { authUser } = useAuth();
  const { isUpdatingProfile, updateProfile } = useUser();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const image = reader.result as string;
      setSelectedImage(image);
      await updateProfile({ profilePic: image });
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/*Avatar upload*/}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-36 h-36">
              <img
                src={selectedImage || authUser?.profilePic || '/avatar.svg'}
                alt="User"
                className="w-full h-full rounded-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className={` absolute inset-0 flex items-center justify-center bg-base-content/15 hover:bg-base-content/30
                p-2 rounded-full cursor-pointer transition-all duration-250 ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}`}
              >
                {isUpdatingProfile ? (
                  <Loader2 className="size-8 animate-spin" />
                ) : (
                  <Camera className="size-8 text-white" />
                )}

                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? 'Uploading...' : 'Upload your profile picture'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.name}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-1">
                <span>Member Since</span>
                <span>
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toISOString().split('T')[0].replace(/-/g, ' ')
                    : 'N/A'}
                </span>
              </div>

              <hr className="border-base-content/20" />

              <div className="flex items-center justify-between py-1">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
