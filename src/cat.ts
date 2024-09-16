import fs from "fs"
import process from "process"
import path from "path"
import core from "./core-singleton"

import { Platform } from "./types"

// https://cdn.7tv.app/emote/63da116254caa117064ebcd3/4x.webp
const cromch = (root: string) => {
	const cfg = path.join(root, "platform.txt")
	let p = Platform.steam as string

	if (!fs.existsSync(cfg)) {
		try {
			fs.writeFileSync(cfg, p, "utf-8")
		} catch {}
	} else {
		try {
			p = fs.readFileSync(cfg, "utf-8").trim().toLowerCase()
		} catch {}
	}

	const validPlatforms = Object.values(Platform) as string[]
	if (!validPlatforms.includes(p)) {
		void core.logger.warn(`Invalid platform '${p}' set in '${cfg}' (expected one of [${validPlatforms.join(", ")}])`)
	}

	return p as Platform
}

export default async () => {
	core.config.reportErrors = false
	core.config.errorReportingID = null

	void core.logger.warn("This software has been modified. Do not share logs or report bugs.")
	await new Promise((resolve) => setTimeout(resolve, 1000))

	if (!core.config.platform) {
		core.config.platform = cromch(process.cwd())
	}
}
