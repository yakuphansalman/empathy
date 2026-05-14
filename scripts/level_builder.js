class LevelBuilder {
    static build(level) {
        if(level === -1){
            GameManager.current = new Knight2(500,500);
            new Obstacle(500, 520, 100, 20);
            new Obstacle(0, 700, 5000, 500);
            new Knight0(500, 600).neutral = false;
            new Obstacle(500, 620, 100, 20);
            
            for(let i = 0;i< GameManager.characterRoster.length; i++){
                GameManager.nextEntity(100 + i*100, 700);
            }


        }
        if (level === 0) {
            let sceneWidth = 6500;
            GameManager.current = new Knight2(500, 700);

            // Yeryüzü
            new Obstacle(-500, 700, 5100, 500);
            new Obstacle(5300, 600, 3500, 600);
            // Sol ana engel
            new Obstacle(0, 0, 400, 700);
            // Sağ ana engel
            new Obstacle(sceneWidth, 0, 3000, 700);

            // Birinci bölge
            new Obstacle(1000, 600, 200, 200);

            new Obstacle(1900, 620, 200, 20);
            new PatrolPoint(2000, 700, 150);
            new Warrior0(2000, 700);

            // İkinci bölge
            new Obstacle(2900, 600, 200, 20);
            new Obstacle(3100, 500, 200, 20);
            new Obstacle(3300, 400, 200, 20);
            new Obstacle(3100, 300, 200, 20);
            new Obstacle(3300, 200, 800, 20);

            new PatrolPoint(3450, 700, 250);
            new Samurai0(3450, 700);

            // Büyük engel
            new Obstacle(4200, 200, 400, 700);

            new Obstacle(4700, 300, 160, 20);
            new Obstacle(4900, 400, 220, 20);
            new Obstacle(4700, 500, 170, 20);
            new Obstacle(4900, 600, 210, 20);

            // Üçüncü bölge
            new Obstacle(5500, 500, 100, 100);

            new Obstacle(5900, 500, 300, 20);
            new PatrolPoint(6050, 600, 150);

            new Knight0(6050, 500);
            new Demon0(6050, 600);

            // Son engel
            new Obstacle(6200, 400, 250, 20);

            // Bulutlar
            let cloudCount = 150;
            for (let i = 0; i < cloudCount; i++) {
                let cloudPosX = Math.random() * (sceneWidth + 2000);
                let cloudPosY = GameManager.randomApproachMax(300, 0, 1.7);
                let cloudPosZ = (Math.random() * 0.2) + 0.2;
                let cloudNumber = Math.floor(Math.random() * 10);
                new Cloud(cloudPosX, cloudPosY, cloudPosZ, cloudNumber);
            }

            // Birinci yeryüzü için çalılar
            let bushCount0 = 125;
            for (let i = 0; i < bushCount0; i++) {
                let bushPosX = 200 + Math.random() * 4000;
                let bushPosY = 690;
                let bushPosZ = (Math.random() * 0.08) + 0.0;
                let bushNumber = Math.floor(Math.random() * 15);
                let color = Math.floor(Math.random() * 2);
                let colors = ["g", "y"];

                new Bush(bushPosX, bushPosY, bushPosZ, bushNumber, colors[color]);
            }
            // İkinci yeryüzü için çalılar
            let bushCount1 = 60;
            for (let i = 0; i < bushCount1; i++) {
                let bushPosX = 5500 + Math.random() * 1200;
                let bushPosY = 590;
                let bushPosZ = (Math.random() * 0.08) + 0.0;
                let bushNumber = Math.floor(Math.random() * 15);
                let color = Math.floor(Math.random() * 2);
                let colors = ["g", "y"];

                new Bush(bushPosX, bushPosY, bushPosZ, bushNumber, colors[color]);
            }

        }

        else if (level === 1) {
            let sceneWidth = 4600;
            GameManager.current = new Knight2(2500, 700);
            // Sol ana engel
            new Obstacle(0, 0, 400, 700);
            // Sağ ana engel
            new Obstacle(sceneWidth, 0, 3000, 700);

            let partWidth = 600;
            for (let j = 0; j < 10; j++) {
                let s = Math.min(j, 10 - j);
                let currentX = -500 + 540 * j;
                let currentY = 500 + 70 * s;
                let width = 500; let height = 500;
                new Obstacle(currentX, currentY, width, height);
                new PatrolPoint(currentX + width / 2, currentY, width / 2);
                GameManager.nextEntity(currentX + width / 2, currentY);

                let offset = 0.1;
                let bushCount = 15;
                for (let i = 0; i < bushCount; i++) {
                    let bushPosX = currentX + width * offset + Math.random() * width * (0.9 - offset);
                    let bushPosY = currentY - 10;
                    let bushPosZ = (Math.random() * 0.02) + 0.0;
                    let bushNumber = Math.floor(Math.random() * 15);
                    let color = Math.floor(Math.random() * 2);
                    let colors = ["g", "y"];

                    new Bush(bushPosX, bushPosY, bushPosZ, bushNumber, colors[color]);
                }
            }
            // Bulutlar
            let cloudCount = 150;
            for (let i = 0; i < cloudCount; i++) {
                let cloudPosX = Math.random() * (sceneWidth + 2000);
                let cloudPosY = GameManager.randomApproachMax(300, 0, 1.7);
                let cloudPosZ = (Math.random() * 0.2) + 0.2;
                let cloudNumber = Math.floor(Math.random() * 10);
                new Cloud(cloudPosX, cloudPosY, cloudPosZ, cloudNumber);
            }
        }

        else if (level === 2) {

            let sceneWidth = 5200;
            GameManager.current = new Warrior1(300, 700);

            // Ana zemin
            new Obstacle(-500, 700, 6200, 500);

            // Sınırlar
            new Obstacle(0, 0, 350, 700);
            new Obstacle(sceneWidth, 0, 3000, 700);

            // BÖLGE 1
            new Obstacle(800, 600, 220, 100);
            new Obstacle(980, 520, 220, 100);
            new Obstacle(1180, 440, 350, 100);

            new PatrolPoint(1320, 440, 120);
            new King0(1320, 440);

            // Geçiş
            new Obstacle(1600, 520, 180, 20);
            new Obstacle(1830, 600, 350, 20);

            new PatrolPoint(1970, 600, 100);
            new Hero0(1970, 600);

            // BÖLGE 2
            new Obstacle(2300, 520, 160, 20);
            new Obstacle(2520, 440, 160, 20);
            new Obstacle(2740, 520, 160, 20);
            new Obstacle(2960, 440, 430, 20);

            new PatrolPoint(3120, 440, 120);
            new Monk0(3120, 440);

            // BÖLGE 3
            new Obstacle(3480, 360, 160, 340);

            new Obstacle(3660, 320, 180, 20);
            new Obstacle(3880, 260, 350, 20);

            new PatrolPoint(4040, 260, 120);
            new Demon0(4040, 260);

            // Final bölgesi
            new Obstacle(4160, 340, 200, 20);
            new Obstacle(4400, 440, 200, 20);
            new Obstacle(4640, 540, 200, 20);
            new Obstacle(4880, 640, 500, 20);
            new Obstacle(5020, 740, 500, 20);

            new PatrolPoint(5120, 560, 180);
            new Warrior3(5120, 560);

            // Bulutlar
            let cloudCount = 120;
            for (let i = 0; i < cloudCount; i++) {
                let cloudPosX = Math.random() * (sceneWidth + 1500);
                let cloudPosY = GameManager.randomApproachMax(250, 0, 1.5);
                let cloudPosZ = (Math.random() * 0.25) + 0.15;

                new Cloud(
                    cloudPosX,
                    cloudPosY,
                    cloudPosZ,
                    Math.floor(Math.random() * 10)
                );
            }

            // Çalılar
            for (let i = 0; i < 90; i++) {
                new Bush(
                    200 + Math.random() * 4700,
                    690,
                    (Math.random() * 0.08),
                    Math.floor(Math.random() * 15),
                    "y"
                );
            }
        }

        else if (level === 3) {

            let sceneWidth = 5600;
            GameManager.current = new Hero0(400, 700);

            // Ana zemin
            new Obstacle(-500, 700, 6500, 500);

            // Sınırlar
            new Obstacle(0, 0, 350, 700);
            new Obstacle(sceneWidth, 0, 3000, 700);

            // BÖLGE 1
            new Obstacle(850, 600, 200, 100);
            new Obstacle(1040, 520, 200, 180);
            new Obstacle(1240, 440, 250, 260);
            new Obstacle(1460, 360, 420, 340);

            new PatrolPoint(1640, 360, 140);
            new Warrior2(1640, 360);

            // BÖLGE 2
            new Obstacle(2050, 340, 140, 20);
            new Obstacle(2250, 280, 140, 20);
            new Obstacle(2450, 220, 140, 20);
            new Obstacle(2670, 320, 500, 20);

            new PatrolPoint(2840, 320, 140);
            new Warrior1(2840, 320);

            // İniş
            new Obstacle(3250, 420, 210, 20);
            new Obstacle(3450, 520, 210, 20);
            new Obstacle(3670, 620, 220, 20);
            new Obstacle(3950, 620, 520, 20);

            new PatrolPoint(4150, 620, 160);
            new Knight2(4150, 620);

            // Final tırmanışı
            new Obstacle(4550, 520, 250, 180);
            new Obstacle(4780, 420, 250, 280);
            new Obstacle(5020, 320, 700, 380);

            new PatrolPoint(5340, 320, 240);

            new Knight1(5340, 320);

            // Bulutlar
            let cloudCount = 140;
            for (let i = 0; i < cloudCount; i++) {
                let cloudPosX = Math.random() * (sceneWidth + 1500);
                let cloudPosY = GameManager.randomApproachMax(300, 0, 1.8);
                let cloudPosZ = (Math.random() * 0.2) + 0.2;

                new Cloud(
                    cloudPosX,
                    cloudPosY,
                    cloudPosZ,
                    Math.floor(Math.random() * 10)
                );
            }

            // Çalılar
            for (let i = 0; i < 80; i++) {
                new Bush(
                    200 + Math.random() * 5000,
                    690,
                    (Math.random() * 0.08),
                    Math.floor(Math.random() * 15),
                    "g"
                );
            }
        }
    }
}