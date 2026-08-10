import { useAppData } from '../AppDataProvider';
import type { ProfileRepository } from '../../domain/ports';

export function useProfile(): ProfileRepository {
  const data = useAppData();
  return {
    username: data.username,
    setUsername: data.setUsername,
    avatar: data.avatar,
    setAvatar: data.setAvatar,
    locations: data.locations,
    strengthTags: data.strengthTags,
    improvementTags: data.improvementTags,
    profileComplete: data.profileComplete,
    profileSkipped: data.profileSkipped,
    setProfileComplete: data.setProfileComplete,
    setProfileSkipped: data.setProfileSkipped,
    addStrengthTag: data.addStrengthTag,
    removeStrengthTag: data.removeStrengthTag,
    addImprovementTag: data.addImprovementTag,
    removeImprovementTag: data.removeImprovementTag,
    addLocation: data.addLocation,
    addLocationWithLevels: data.addLocationWithLevels,
    updateLocation: data.updateLocation,
    removeLocation: data.removeLocation,
    setHomeLocation: data.setHomeLocation,
    addLevel: data.addLevel,
    removeLevel: data.removeLevel,
    moveLevel: data.moveLevel,
    swapLevels: data.swapLevels,
    toggleLevelSort: data.toggleLevelSort,
    updateLevel: data.updateLevel,
  };
}
