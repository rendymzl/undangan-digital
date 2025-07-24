import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { AcaraData } from '@/types';

// Helper untuk Leaflet agar marker bisa muncul
function LocationPicker({ lat, lng, onChange }: { lat?: number | null, lng?: number | null, onChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => onChange(e.latlng.lat, e.latlng.lng),
    });
    const icon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] });
    return (lat && lng) ? <Marker position={[lat, lng]} icon={icon} /> : null;
}

// Definisikan tipe untuk Props
type LocationInputProps = {
    acaraData: AcaraData;
    path: string;
    updateForm: (path: string, value: any) => void;
    disabled?: boolean;
};

// Komponen utama
export const LocationInput: React.FC<LocationInputProps> = ({ acaraData, path, updateForm, disabled = false }) => {
    const [mode, setMode] = useState<'url' | 'pin'>(acaraData.lokasiUrl ? 'url' : 'pin');

    const validateGoogleMapsUrl = (url: string) => {
        return /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/.test(url);
    };

    return (
        <div>
            <Label className="block mb-2">Lokasi Acara</Label>
            <Textarea
                value={acaraData.lokasi || ''}
                onChange={e => updateForm(`${path}.lokasi`, e.target.value)}
                placeholder="Nama gedung atau alamat lengkap"
                className="bg-white mb-2"
                disabled={disabled}
            />
            <Tabs value={mode} onValueChange={(val) => setMode(val as 'url' | 'pin')} className="mb-2">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url" disabled={disabled}>Input URL</TabsTrigger>
                    <TabsTrigger value="pin" disabled={disabled}>Pin di Peta</TabsTrigger>
                </TabsList>
                <TabsContent value="url">
                    <Input
                        value={acaraData.lokasiUrl || ''}
                        onChange={e => updateForm(`${path}.lokasiUrl`, e.target.value)}
                        placeholder="Link Google Maps"
                        className="bg-white"
                        disabled={disabled}
                    />
                    {acaraData.lokasiUrl && !validateGoogleMapsUrl(acaraData.lokasiUrl) &&
                        <p className="text-xs text-red-500 mt-1">URL Google Maps tidak valid.</p>}
                </TabsContent>
                <TabsContent value="pin">
                    <div className="my-2 rounded-lg overflow-hidden" style={disabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}>
                        <MapContainer
                            center={[acaraData.lokasiLat || -6.2, acaraData.lokasiLng || 106.8]}
                            zoom={13}
                            style={{ height: 200, width: '100%' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationPicker
                                lat={acaraData.lokasiLat}
                                lng={acaraData.lokasiLng}
                                onChange={(lat, lng) => {
                                    updateForm(`${path}.lokasiLat`, lat);
                                    updateForm(`${path}.lokasiLng`, lng);
                                }}
                            />
                        </MapContainer>
                        <div className="text-xs text-gray-500 mt-1">Klik pada peta untuk memilih lokasi.</div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};