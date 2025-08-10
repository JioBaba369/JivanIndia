
'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useIndiaLocations } from '@/hooks/use-india-locations';

interface IndiaStateDistrictSelectorProps {
  stateValue?: string;
  districtValue?: string;
  onStateChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
}

export default function IndiaStateDistrictSelector({
  stateValue,
  districtValue,
  onStateChange,
  onDistrictChange,
}: IndiaStateDistrictSelectorProps) {
  const { states, getDistrictsByState } = useIndiaLocations();
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (stateValue) {
      setDistricts(getDistrictsByState(stateValue));
    } else {
      setDistricts([]);
    }
  }, [stateValue, getDistrictsByState]);
  
  const handleStateChange = (value: string) => {
    onStateChange(value);
    onDistrictChange(''); // Reset district when state changes
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>State</Label>
        <Select onValueChange={handleStateChange} value={stateValue || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
          <SelectContent>
            {states.map(state => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>District</Label>
        <Select onValueChange={onDistrictChange} value={districtValue || ''} disabled={!stateValue || districts.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder="Select a district" />
            </SelectTrigger>
          <SelectContent>
            {districts.map(district => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
