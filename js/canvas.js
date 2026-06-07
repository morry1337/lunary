// Canvas анимация фона
(function() {
    const canvas = document.getElementById('scene');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let shapes = [];
    let lastTimestamp = performance.now();
    
    function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const rand = (min, max) => Math.random() * (max - min) + min;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const SHAPES = ['circle','triangle','square','pentagon','hexagon','diamond','star4','heart','cross','crescent','drop','ring','arrow','dot'];

    class Particle {
        constructor(type, x, y) {
            this.type = type; this.x = x; this.y = y; this.size = rand(5,18);
            if (type==='dot') this.size=rand(2,6);
            if (type==='cross') this.size=rand(6,16);
            if (type==='heart') this.size=rand(7,16);
            if (type==='drop') this.size=rand(6,15);
            if (type==='crescent') this.size=rand(8,18);
            if (type==='arrow') this.size=rand(8,16);
            this.speed = rand(12,35);
            this.rotation = rand(0,Math.PI*2);
            this.rotationSpeed = Math.random()<0.4?rand(-0.2,0.2):0;
            this.alpha = rand(0.12,0.35);
            this.lineWidth = rand(0.4,0.9);
            if (type==='crescent') this.crescentRatio=rand(0.4,0.7);
            if (type==='drop') this.dropRatio=rand(0.7,1.2);
        }

        update(dt) {
            this.y += this.speed * dt;
            this.rotation += this.rotationSpeed * dt;
            if (this.y > height + this.size*2) {
                this.y = -this.size*2;
                this.x = rand(this.size, width-this.size);
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.strokeStyle = `rgba(255,255,255,${this.alpha})`;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            const h = this.size/2;

            switch(this.type) {
                case 'circle': ctx.arc(0,0,h,0,Math.PI*2); break;
                case 'triangle': this._polygon(ctx,3,h); break;
                case 'square': this._polygon(ctx,4,h); break;
                case 'pentagon': this._polygon(ctx,5,h); break;
                case 'hexagon': this._polygon(ctx,6,h); break;
                case 'diamond':
                    ctx.moveTo(0,-h); ctx.lineTo(h,0);
                    ctx.lineTo(0,h); ctx.lineTo(-h,0);
                    ctx.closePath(); break;
                case 'star4': this._star(ctx,4,h,h*0.45); break;
                case 'heart': this._heart(ctx,h); break;
                case 'cross': this._cross(ctx,h); break;
                case 'crescent': this._crescent(ctx,h); break;
                case 'drop': this._drop(ctx,h); break;
                case 'ring': ctx.arc(0,0,h*0.7,0,Math.PI*2); break;
                case 'arrow': this._arrow(ctx,h); break;
                case 'dot': ctx.arc(0,0,h*0.6,0,Math.PI*2); break;
                default: ctx.arc(0,0,h,0,Math.PI*2);
            }
            ctx.stroke();
            ctx.restore();
        }

        _polygon(ctx,s,r) {
            const step = Math.PI*2/s;
            const start = -Math.PI/2;
            for(let i=0;i<s;i++) {
                const a = start+i*step;
                i===0 ? ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
            }
            ctx.closePath();
        }

        _star(ctx,p,oR,iR) {
            const step = Math.PI/p;
            const start = -Math.PI/2;
            for(let i=0;i<p*2;i++) {
                const a = start+i*step;
                const r = i%2===0?oR:iR;
                i===0 ? ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
            }
            ctx.closePath();
        }

        _heart(ctx,s) {
            const sz = s*0.5;
            ctx.moveTo(0,sz*0.6);
            ctx.bezierCurveTo(-sz*0.8,-sz*0.2,-sz*0.5,-sz*0.9,0,-sz*0.4);
            ctx.bezierCurveTo(sz*0.5,-sz*0.9,sz*0.8,-sz*0.2,0,sz*0.6);
            ctx.closePath();
        }

        _cross(ctx,h) {
            const arm = h*0.6, t = h*0.25;
            ctx.moveTo(-t,-h); ctx.lineTo(t,-h); ctx.lineTo(t,-arm);
            ctx.lineTo(h,-arm); ctx.lineTo(h,arm); ctx.lineTo(t,arm);
            ctx.lineTo(t,h); ctx.lineTo(-t,h); ctx.lineTo(-t,arm);
            ctx.lineTo(-h,arm); ctx.lineTo(-h,-arm); ctx.lineTo(-t,-arm);
            ctx.closePath();
        }

        _crescent(ctx,h) {
            ctx.arc(0,0,h,-Math.PI*0.5,Math.PI*0.5);
            ctx.arc(h*0.2,0,h*this.crescentRatio,Math.PI*0.5,-Math.PI*0.5,true);
            ctx.closePath();
        }

        _drop(ctx,h) {
            const hh = h*1.4, w = h*0.9;
            ctx.moveTo(0,hh);
            ctx.bezierCurveTo(-w,hh*0.4,-w,-hh*0.2,0,-hh*0.5);
            ctx.bezierCurveTo(w,-hh*0.2,w,hh*0.4,0,hh);
            ctx.closePath();
        }

        _arrow(ctx,h) {
            const hh = h*1.2, w = h*0.7;
            ctx.moveTo(0,hh); ctx.lineTo(w,-hh*0.3); ctx.lineTo(w*0.5,-hh*0.3);
            ctx.lineTo(w*0.5,-h); ctx.lineTo(-w*0.5,-h);
            ctx.lineTo(-w*0.5,-hh*0.3); ctx.lineTo(-w,-hh*0.3);
            ctx.closePath();
        }
    }

    function createParticles(n) {
        shapes = [];
        for(let i=0;i<n;i++) {
            let t = pick(SHAPES);
            shapes.push(new Particle(t, rand(10,width-10), rand(-height*0.3,height*1.2)));
        }
    }

    function adjustParticleCount() {
        let target = Math.max(45, Math.min(110, Math.floor(width*height/2200)));
        if(shapes.length===0) { createParticles(target); return; }
        let diff = target-shapes.length;
        if(diff>5) {
            for(let i=0;i<diff;i++) {
                let t = pick(SHAPES);
                shapes.push(new Particle(t, rand(10,width-10), rand(-height*0.2,height)));
            }
        } else if(diff<-5) {
            shapes.splice(target);
        }
    }

    function reclamp() {
        for(let p of shapes) {
            if(p.x>width+p.size) p.x=rand(10,width-10);
            if(p.y>height+p.size*3) p.y=-p.size*2;
            if(p.y<-p.size*4) p.y=rand(0,height);
        }
    }

    function frame(ts) {
        let dt = Math.min((ts - lastTimestamp) / 1000, 0.1);
        lastTimestamp = ts;
        ctx.clearRect(0, 0, width, height);
        for (let p of shapes) p.update(dt), p.draw(ctx);
        window.canvasAnimationId = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', () => {
        clearTimeout(window._resizeTimeout);
        window._resizeTimeout = setTimeout(() => {
            resizeCanvas();
            reclamp();
            adjustParticleCount();
        }, 250);
    });

    // Экспорт для управления темой
    window.startCanvas = function() {
        if (window.canvasAnimationId) cancelAnimationFrame(window.canvasAnimationId);
        lastTimestamp = performance.now();
        requestAnimationFrame(frame);
    };
    window.stopCanvas = function() {
        if (window.canvasAnimationId) {
            cancelAnimationFrame(window.canvasAnimationId);
            window.canvasAnimationId = null;
        }
    };

    resizeCanvas();
    createParticles(60);
    lastTimestamp = performance.now();
    requestAnimationFrame(frame);
})();