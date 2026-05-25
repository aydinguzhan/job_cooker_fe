import { useEffect, useState } from "react";
import FollowsTabs from "../../components/follows/FollowsTabs";
import FollowUserCard from "../../components/follows/FollowUserCard";
import JobCookerLoader from "../../components/ui/Loader";
import {
  followUser,
  getFollowers,
  getFollowSuggestions,
  getFollowings,
  unfollowUser,
} from "../../services/follows.service";
import type { FollowTab, FollowUser } from "../../types/follow.types";

type FollowCollections = Record<FollowTab, FollowUser[]>;

const emptyCollections: FollowCollections = {
  suggestions: [],
  followers: [],
  followings: [],
};

async function fetchFollowCollection(tab: FollowTab) {
  switch (tab) {
    case "suggestions":
      return getFollowSuggestions();
    case "followers":
      return getFollowers();
    case "followings":
      return getFollowings();
  }
}

export default function FollowsPage() {
  const [activeTab, setActiveTab] = useState<FollowTab>("suggestions");
  const [collections, setCollections] =
    useState<FollowCollections>(emptyCollections);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        setIsLoading(true);
        const [suggestions, followers, followings] = await Promise.all([
          getFollowSuggestions(),
          getFollowers(),
          getFollowings(),
        ]);

        setCollections({
          suggestions,
          followers,
          followings,
        });
      } catch (error) {
        console.error("Follows page fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollections();
  }, []);

  useEffect(() => {
    async function refreshActiveTab() {
      try {
        const nextCollection = await fetchFollowCollection(activeTab);

        setCollections((prev) => ({
          ...prev,
          [activeTab]: nextCollection,
        }));
      } catch (error) {
        console.error(`Follows ${activeTab} refresh error:`, error);
      }
    }

    refreshActiveTab();
  }, [activeTab]);

  async function handleFollow(target: FollowUser) {
    try {
      setPendingUserId(target.id);
      await followUser(target.id);

      setCollections((prev) => ({
        suggestions: prev.suggestions.filter((user) => user.id !== target.id),
        followers: prev.followers.map((user) =>
          user.id === target.id
            ? {
                ...user,
                is_following: true,
              }
            : user,
        ),
        followings: [
          {
            ...target,
            is_following: true,
          },
          ...prev.followings.filter((user) => user.id !== target.id),
        ],
      }));
    } catch (error) {
      console.error("Follow action error:", error);
    } finally {
      setPendingUserId(null);
    }
  }

  async function handleUnfollow(target: FollowUser) {
    try {
      setPendingUserId(target.id);
      await unfollowUser(target.id);

      setCollections((prev) => ({
        suggestions: prev.suggestions,
        followers: prev.followers.map((user) =>
          user.id === target.id
            ? {
                ...user,
                is_following: false,
              }
            : user,
        ),
        followings: prev.followings.filter((user) => user.id !== target.id),
      }));
    } catch (error) {
      console.error("Unfollow action error:", error);
    } finally {
      setPendingUserId(null);
    }
  }

  const visibleUsers = collections[activeTab];
  const fallbackSuggestions = collections.suggestions.filter(
    (user) => !visibleUsers.some((visibleUser) => visibleUser.id === user.id),
  );

  if (isLoading) return <JobCookerLoader />;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.28),_transparent_30%),linear-gradient(135deg,#022c22_0%,#14532d_35%,#0f172a_100%)] px-6 py-8 text-white md:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
              Network
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Takip ağını büyüt ve seni takip edenleri yönet.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
              Önerileri keşfet, seni takip edenleri görüntüle ve takip ettiğin
              kişileri tek ekrandan yönet.
            </p>
          </div>
        </section>

        <FollowsTabs activeTab={activeTab} onChange={setActiveTab} />

        <section className="space-y-4">
          {visibleUsers.length === 0 ? (
            <>
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500 shadow-sm">
                Bu sekmede henüz gösterilecek kullanıcı yok.
              </div>

              {activeTab !== "suggestions" && fallbackSuggestions.length > 0 && (
                <div className="space-y-4">
                  <div className="px-1">
                    <h2 className="text-lg font-semibold text-slate-950">
                      Takip etmeye başlamak için öneriler
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Henüz bağlantın yoksa buradan kullanıcıları takip ederek ağını
                      oluşturabilirsin.
                    </p>
                  </div>

                  {fallbackSuggestions.map((user) => (
                    <FollowUserCard
                      key={user.id}
                      user={user}
                      isPending={pendingUserId === user.id}
                      actionLabel="Follow"
                      actionVariant="follow"
                      onAction={handleFollow}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            visibleUsers.map((user) => {
              const isFollowAction = activeTab !== "followings" && !user.is_following;

              return (
                <FollowUserCard
                  key={user.id}
                  user={user}
                  isPending={pendingUserId === user.id}
                  actionLabel={isFollowAction ? "Follow" : "Unfollow"}
                  actionVariant={isFollowAction ? "follow" : "unfollow"}
                  onAction={isFollowAction ? handleFollow : handleUnfollow}
                />
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
