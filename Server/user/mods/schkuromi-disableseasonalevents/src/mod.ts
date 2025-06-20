import { DependencyContainer } from "tsyringe";

import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";

class Mod implements IPreSptLoadMod
{
    public preSptLoad(container: DependencyContainer): void
    {
        // get the config server so we can get a config with it
        const configServer = container.resolve<ConfigServer>("ConfigServer");

        // Request seasonal event config
        const seasonConfig: ISeasonalEventConfig = configServer.getConfig<ISeasonalEventConfig>(ConfigTypes.SEASONAL_EVENT);

        // Disable the seasonal event detection
        seasonConfig.enableSeasonalEventDetection = false;

        // extra make sure that events are disabled
        for (const i in seasonConfig.events)
        {
            seasonConfig.events[i].enabled = false;
        }

        // Log the new seasonal event setting
        console.log("[SCHKRM] Seasonal events are now off.");
    }
}

export const mod = new Mod();
