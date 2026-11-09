type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageData: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type UnsubscribeFunction = () => void;

// type EventPayloadMapping = {
//     statistics: Statistics;
//     getStaticData: StaticData;
// }

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  "generate-pdf": {
    // ← NEW
    success: boolean;
    filePath?: string;
    message?: string;
    error?: string;
  };
  // ... other channels
};

interface Window {
  electron: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void,
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
  };
}
