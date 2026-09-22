document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('no-scroll');
    const sections = ['bismillah', 'mempelai', 'countdown', 'acara', 'doa', 'galeri', 'lovestory', 'gift', 'ucapan'];
    let currentIndex = 0;

    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    let isPlaying = false;

    function playMusic() {
        if (!bgMusic) return;
        bgMusic.currentTime = 33;
        bgMusic.volume = 0.4;
        bgMusic.play().then(() => {
            isPlaying = true;
            if (musicIcon) musicIcon.textContent = '🔊';
        }).catch(err => {
            console.log('Autoplay dicegah oleh browser:', err);
        });
    }

    function toggleMusic() {
        if (!bgMusic) return;
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            if (musicIcon) musicIcon.textContent = '🔇';
        } else {
            bgMusic.currentTime = 33;
            bgMusic.play();
            isPlaying = true;
            if (musicIcon) musicIcon.textContent = '🔊';
        }
    }

    if (musicToggle) {
        musicToggle.classList.add('hidden');
        musicToggle.addEventListener('click', toggleMusic);
    }

    document.getElementById('openInvite').addEventListener('click', () => {
        const hero = document.getElementById('hero');
        hero.style.transition = 'opacity 0.8s ease';
        hero.style.opacity = '0';

        setTimeout(() => {
            hero.classList.add('hidden');
            document.getElementById('bismillah').classList.remove('hidden');
            document.getElementById('bismillah').style.opacity = '0';
            document.getElementById('bismillah').style.transition = 'opacity 0.8s ease';
            requestAnimationFrame(() => {
                document.getElementById('bismillah').style.opacity = '1';
            });

            currentIndex = 1;
            document.body.classList.remove('no-scroll');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (musicToggle) {
                musicToggle.classList.remove('hidden');
            }
            playMusic();
        }, 800);
    });

    function showNextSection() {
        if (currentIndex >= sections.length) return;

        const section = document.getElementById(sections[currentIndex]);
        if (!section || !section.classList.contains('hidden')) return;

        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
            section.classList.remove('hidden');
            section.style.opacity = '0';
            section.style.transition = 'opacity 0.8s ease';
            requestAnimationFrame(() => {
                section.style.opacity = '1';
            });
            currentIndex++;
        }
    }

    window.addEventListener('scroll', showNextSection, { passive: true });

    const weddingDate = new Date('2026-10-07T09:00:00+07:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    const showGiftBtn = document.getElementById('showGiftBtn');
    const giftDetails = document.getElementById('giftDetails');

    if (showGiftBtn && giftDetails) {
        showGiftBtn.addEventListener('click', () => {
            giftDetails.classList.toggle('hidden');
            showGiftBtn.textContent = giftDetails.classList.contains('hidden') ? 'Lihat Rekening' : 'Tutup';
        });
    }

    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(text);
                const original = btn.textContent;
                btn.textContent = 'Tersalin! ✓';
                setTimeout(() => {
                    btn.textContent = original;
                }, 2000);
            } catch (err) {
                console.error('Gagal menyalin:', err);
            }
        });
    });

    const ucapanData = [];
    let hadirCount = 0;
    let tidakHadirCount = 0;

    function updateStats() {
        document.querySelector('.ucapan-stats span').textContent = `${hadirCount} Hadir • ${tidakHadirCount} Tidak Hadir`;
    }

    function renderUcapan() {
        const list = document.getElementById('ucapanList');
        if (!list) return;
        list.innerHTML = ucapanData.map(item => `
            <div class="ucapan-item">
                <div class="ucapan-item-header">
                    <span class="ucapan-item-name">${item.nama}</span>
                    <span class="ucapan-item-status ${item.kehadiran === 'tidak' ? 'tidak' : ''}">${item.kehadiran === 'hadir' ? 'Hadir' : 'Tidak Hadir'}</span>
                </div>
                <p class="ucapan-item-text">${item.ucapan}</p>
            </div>
        `).join('');
        updateStats();
    }

    renderUcapan();

    const kirimUcapanBtn = document.getElementById('kirimUcapan');
    if (kirimUcapanBtn) {
        kirimUcapanBtn.addEventListener('click', () => {
            const nama = document.getElementById('nama').value.trim();
            const ucapan = document.getElementById('ucapanText').value.trim();
            const kehadiranRadio = document.querySelector('input[name="kehadiran"]:checked');

            if (!nama || !ucapan) {
                alert('Mohon lengkapi nama dan ucapan Anda.');
                return;
            }

            const kehadiran = kehadiranRadio ? kehadiranRadio.value : 'hadir';

            if (kehadiran === 'hadir') hadirCount++;
            else tidakHadirCount++;

            ucapanData.unshift({
                nama,
                kehadiran,
                ucapan,
                waktu: 'Baru saja'
            });

            renderUcapan();
            document.getElementById('nama').value = '';
            document.getElementById('ucapanText').value = '';
            const checkedRadio = document.querySelector('input[name="kehadiran"]:checked');
            if (checkedRadio) checkedRadio.checked = false;
            const hadirRadio = document.querySelector('input[name="kehadiran"][value="hadir"]');
            if (hadirRadio) hadirRadio.checked = true;
        });
    }

    function revealOnScroll() {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
