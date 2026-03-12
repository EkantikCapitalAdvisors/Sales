"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Save, Check } from "lucide-react";

interface SettingsData {
  founding_seat_cap: number;
  alert_thresholds: Record<string, number>;
  email_config: { fromName: string; fromEmail: string };
  whatsapp_config: { enabled: boolean };
  telegram_config: { enabled: boolean };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A4A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Saving..." : "Save Settings"}
            </>
          )}
        </Button>
      </div>

      {/* Seat Cap */}
      <Card>
        <CardHeader>
          <CardTitle>Founding Member Seats</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Seat Count
          </label>
          <Input
            type="number"
            value={settings.founding_seat_cap}
            onChange={(e) =>
              setSettings({
                ...settings,
                founding_seat_cap: Number(e.target.value),
              })
            }
            className="w-32"
          />
          <p className="text-xs text-gray-400 mt-1">
            The total number of founding member seats available. The seat counter
            on the pipeline will reflect this.
          </p>
        </CardContent>
      </Card>

      {/* Email Config */}
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Name
            </label>
            <Input
              value={settings.email_config.fromName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  email_config: {
                    ...settings.email_config,
                    fromName: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Email
            </label>
            <Input
              type="email"
              value={settings.email_config.fromEmail}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  email_config: {
                    ...settings.email_config,
                    fromEmail: e.target.value,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Config */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.whatsapp_config.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  whatsapp_config: {
                    ...settings.whatsapp_config,
                    enabled: e.target.checked,
                  },
                })
              }
              className="rounded border-gray-300 h-5 w-5"
            />
            <span className="text-sm text-gray-700">
              Enable WhatsApp messaging
            </span>
          </label>
          <p className="text-xs text-gray-400 mt-2">
            Requires Twilio WhatsApp Business API credentials in environment
            variables.
          </p>
        </CardContent>
      </Card>

      {/* Telegram Config */}
      <Card>
        <CardHeader>
          <CardTitle>Telegram Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.telegram_config.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  telegram_config: {
                    ...settings.telegram_config,
                    enabled: e.target.checked,
                  },
                })
              }
              className="rounded border-gray-300 h-5 w-5"
            />
            <span className="text-sm text-gray-700">
              Enable Telegram messaging
            </span>
          </label>
          <p className="text-xs text-gray-400 mt-2">
            Requires Telegram Bot API token in environment variables.
          </p>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>KPI Alert Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(settings.alert_thresholds).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      alert_thresholds: {
                        ...settings.alert_thresholds,
                        [key]: Number(e.target.value),
                      },
                    })
                  }
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
