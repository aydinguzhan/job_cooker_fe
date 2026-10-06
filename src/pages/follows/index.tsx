import { useEffect, useState } from "react";
import FollowsTabs from "../../components/follows/FollowsTabs";
import FollowUserCard from "../../components/follows/FollowUserCard";
import NetworkPageSkeleton from "../../components/spinner/NetworkPageSkeleton";
import { useTranslation } from "../../lang/useTranslation";
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
  const { t } = useTranslation();
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
  const counts = {
    suggestions: collections.suggestions.length,
    followers: collections.followers.length,
    followings: collections.followings.length,
  };
  const activeTabMeta = {
    suggestions: {
      title: t("follows.suggestionsTitle"),
      description: t("follows.suggestionsBody"),
    },
    followers: {
      title: t("follows.followersTitle"),
      description: t("follows.followersBody"),
    },
    followings: {
      title: t("follows.followingsTitle"),
      description: t("follows.followingsBody"),
    },
  }[activeTab];

  if (isLoading) return <NetworkPageSkeleton />;

  return (
    <main className="min-h-screen bg-app px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <FollowsTabs
          activeTab={activeTab}
          counts={counts}
          onChange={setActiveTab}
        />

        <section className="rounded-2xl border border-app bg-surface p-5 shadow-surface backdrop-blur">
          <div className="mb-5 flex flex-col gap-3 border-b border-app pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                {t("follows.activeView")}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-app">
                {activeTabMeta.title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-soft">
                {activeTabMeta.description}
              </p>
            </div>

            <div className="rounded-2xl bg-surface-muted px-4 py-3 text-sm text-muted ring-1 ring-(--border-color)">
              <span className="font-semibold text-app">
                {t("follows.showingUsers", { count: visibleUsers.length })}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {visibleUsers.length === 0 ? (
              <>
                <div className="rounded-2xl border border-dashed border-app bg-surface-muted px-6 py-14 text-center shadow-surface">
                  <p className="text-base font-semibold text-app">
                    {t("follows.emptyTitle")}
                  </p>
                  <p className="mt-2 text-sm text-soft">
                    {t("follows.emptyDescription")}
                  </p>
                </div>

                {activeTab !== "suggestions" &&
                  fallbackSuggestions.length > 0 && (
                    <div className="space-y-4">
                      <div className="px-1 pt-2">
                        <h3 className="text-lg font-semibold text-app">
                          {t("follows.fallbackTitle")}
                        </h3>
                        <p className="mt-1 text-sm text-soft">
                          {t("follows.fallbackDescription")}
                        </p>
                      </div>

                      {fallbackSuggestions.map((user) => (
                        <FollowUserCard
                          key={user.id}
                          user={user}
                          isPending={pendingUserId === user.id}
                          actionLabel={t("common.follow")}
                          actionVariant="follow"
                          onAction={handleFollow}
                        />
                      ))}
                    </div>
                  )}
              </>
            ) : (
              visibleUsers.map((user) => {
                const isFollowAction =
                  activeTab !== "followings" && !user.is_following;

                return (
                  <FollowUserCard
                    key={user.id}
                    user={user}
                    isPending={pendingUserId === user.id}
                    actionLabel={
                      isFollowAction ? t("common.follow") : t("common.unfollow")
                    }
                    actionVariant={isFollowAction ? "follow" : "unfollow"}
                    onAction={isFollowAction ? handleFollow : handleUnfollow}
                  />
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
