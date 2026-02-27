import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../context/ClubContext';
import type { MatchPhoto } from '../types';

const MAX_MATCHES_WITH_PHOTOS = 5;

export function useMatchPhotos() {
  const { club } = useClub();
  const [photos, setPhotos] = useState<MatchPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cleanupOldPhotos = useCallback(async () => {
    if (!club) return;
    try {
      const { data: recentMatches, error: matchError } = await supabase
        .from('matches')
        .select('id')
        .eq('club_id', club.id)
        .order('date', { ascending: false });

      if (matchError) throw matchError;

      const recentMatchIds = recentMatches?.slice(0, MAX_MATCHES_WITH_PHOTOS).map(m => m.id) || [];
      if (recentMatchIds.length === 0) return;

      const { data: oldPhotos, error: photoError } = await supabase
        .from('match_photos')
        .select('id, photo_url, match_id')
        .not('match_id', 'in', `(${recentMatchIds.join(',')})`);

      if (photoError) throw photoError;
      if (!oldPhotos || oldPhotos.length === 0) return;

      for (const photo of oldPhotos) {
        const fileName = photo.photo_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('match-photos').remove([`photos/${fileName}`]);
        }
      }

      const oldPhotoIds = oldPhotos.map(p => p.id);
      await supabase.from('match_photos').delete().in('id', oldPhotoIds);
    } catch (err) {
      console.error('Failed to cleanup old photos:', err);
    }
  }, [club]);

  const fetchPhotos = useCallback(async () => {
    if (!club) return;
    try {
      setLoading(true);
      await cleanupOldPhotos();

      // Fetch photos for this club's matches only
      const { data: clubMatches } = await supabase
        .from('matches')
        .select('id')
        .eq('club_id', club.id);

      const matchIds = clubMatches?.map(m => m.id) || [];
      if (matchIds.length === 0) {
        setPhotos([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('match_photos')
        .select(`
          *,
          match:matches(id, date, venue, opponent, result, our_score, opponent_score)
        `)
        .in('match_id', matchIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  }, [club, cleanupOldPhotos]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const uploadPhoto = async (matchId: string, file: File, caption?: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${matchId}-${Date.now()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('match-photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('match-photos')
        .getPublicUrl(filePath);

      const { data, error: dbError } = await supabase
        .from('match_photos')
        .insert([{ match_id: matchId, photo_url: publicUrl, caption: caption || null }])
        .select(`
          *,
          match:matches(id, date, venue, opponent, result, our_score, opponent_score)
        `)
        .single();

      if (dbError) throw dbError;
      setPhotos(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to upload photo');
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) throw new Error('Photo not found');

      const fileName = photo.photo_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('match-photos').remove([`photos/${fileName}`]);
      }

      const { error } = await supabase.from('match_photos').delete().eq('id', photoId);
      if (error) throw error;
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete photo');
    }
  };

  const getPhotosByMatch = (matchId: string) => photos.filter(p => p.match_id === matchId);
  const getRecentPhotos = (limit: number = 10) => photos.slice(0, limit);

  return {
    photos, loading, error, fetchPhotos,
    uploadPhoto, deletePhoto, getPhotosByMatch, getRecentPhotos,
  };
}
