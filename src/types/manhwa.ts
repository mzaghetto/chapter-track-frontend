export interface Manhwa {
  id: string;
  name: string;
  coverImage: string;
  author: string;
  description: string;
  status: string;
  source: string;
  source_id: string;
  genres: string[];
  alternativeNames?: string[];
}

export interface DetailedUserManhwa {
  id: string;
  manhwaId: string;
  manhwaName: string;
  coverImage: string;
  providerId: string;
  providerName: string;
  lastEpisodeReleased: number;
  lastEpisodeReleasedAllProviders: number;
  manhwaUrlProvider: string;
  statusReading: string;
  statusManhwa: string;
  lastEpisodeRead: number;
  lastNotifiedEpisode: number;
  isTelegramNotificationEnabled: boolean;
  order: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}