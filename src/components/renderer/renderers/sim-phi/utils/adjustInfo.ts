import { simphiPlayer } from "../playerMain";
import shared from "@utils/js/shared";

// 自动填写歌曲信息
export function adjustInfo() {
    const selectedChart = simphiPlayer.selectchart.value.trim();
    const importedInfo = {
        name: null,
        composer: null,
        illustrator: null,
        charter: null,
        level: "",
        difficulty: "",
    };
    let levelText = "SP Lv.?";

    for (const i of simphiPlayer.chartData.chartInfoData) {
        if (selectedChart && selectedChart === i.Chart) {
            if (i.Name) importedInfo.name = i.Name;
            if (i.Musician) importedInfo.composer = i.Musician;
            if (i.Composer) importedInfo.composer = i.Composer;
            if (i.Artist) importedInfo.composer = i.Artist;
            if (i.Designer) importedInfo.charter = i.Designer;
            if (i.Charter) importedInfo.charter = i.Charter;
            if (i.Illustrator) importedInfo.illustrator = i.Illustrator;
            if (i.Level) {
                levelText = String(i.Level);
                const [level, difficulty] = levelText
                    .toUpperCase()
                    .split("LV.")
                    .map(part => part.trim());
                importedInfo.level = level;
                importedInfo.difficulty = difficulty || "";
            }

            if (simphiPlayer.chartData.bgms.has(i.Music)) simphiPlayer.selectbgm.value = i.Music;
            if (simphiPlayer.chartData.bgs.has(i.Image)) {
                simphiPlayer.selectbg.value = i.Image;
                simphiPlayer.selectbg.dispatchEvent(new Event("change"));
            }

            if (isFinite((i.AspectRatio = parseFloat(i.AspectRatio)))) {
                shared.game.ptmain.gameConfig.aspectRatio = i.AspectRatio;
            }
            if (isFinite((i.ScaleRatio = parseFloat(i.ScaleRatio)))) {
                //Legacy
                shared.game.ptmain.gameConfig.noteScale = 8080 / i.ScaleRatio;
                simphiPlayer.app.setNoteScale(8080 / i.ScaleRatio);
            }
            if (isFinite((i.NoteScale = parseFloat(i.NoteScale)))) {
                shared.game.ptmain.gameConfig.noteScale = i.NoteScale;
                simphiPlayer.app.setNoteScale(i.NoteScale);
            }
            if (isFinite((i.GlobalAlpha = parseFloat(i.GlobalAlpha)))) {
                //Legacy
                shared.game.ptmain.gameConfig.backgroundDim = i.GlobalAlpha;
                shared.game.ptmain.gameConfig.backgroundDim = Number(i.GlobalAlpha);
            }
            if (isFinite((i.BackgroundDim = parseFloat(i.BackgroundDim)))) {
                shared.game.ptmain.gameConfig.backgroundDim = i.BackgroundDim;
                shared.game.ptmain.gameConfig.backgroundDim = Number(i.BackgroundDim);
            }
            if (isFinite((i.Offset = parseFloat(i.Offset))))
                shared.game.ptmain.chartOffsetSurface = i.Offset;
        }
    }

    const { level, difficulty, ...chartInfo } = importedInfo;
    simphiPlayer.chartData.levelText = levelText;
    simphiPlayer.updateChartInfo({
        ...chartInfo,
        difficultyString: `${level || "SP"} Lv.${difficulty || "?"}`,
    });
    return importedInfo;
}
