class SoundManager {
    static maxDistance = 600;

    static play(src, emitterEntity, volume = 1.0) {
        const player = GameManager.current;
        if (!player) return;

        const dist = GameManager.getDistance(emitterEntity, player);
        const spatialVolume = Math.max(0, 1 - dist / SoundManager.maxDistance) * volume;

        if (spatialVolume <= 0) return;

        const sound = new Audio(src);
        sound.volume = spatialVolume;
        sound.play();
    }

    static playBGM(src, volume = 0.4) {
        const bgMusic = new Audio(src);
        bgMusic.loop = true;
        bgMusic.volume = volume;
        return bgMusic;
    }
}