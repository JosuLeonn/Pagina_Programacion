<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
        // Copiar contenido de un bloque de código
        document.querySelectorAll('button.copy').forEach(btn=>{
            btn.addEventListener('click', async ()=> {
                const id = btn.getAttribute('data-target');
                const el = document.getElementById(id);
                const code = el ? el.innerText : btn.closest('div').querySelector('pre code')?.innerText;
                if (!code) return;
                try {
                    await navigator.clipboard.writeText(code.trim());
                    btn.textContent = 'Copiado';
                    setTimeout(()=> btn.textContent = 'Copiar',1200);
                } catch(e) {
                    btn.textContent = 'Error';
                    setTimeout(()=> btn.textContent = 'Copiar',1200);
                }
            });
        });

        // Mostrar/ocultar solución
        function toggleAnswer(id){
            const a = document.getElementById(id);
            if(!a) return;
            a.style.display = a.style.display === 'block' ? 'none' : 'block';
        }

        // Mostrar/ocultar bloques de solución (si los hay con id sol*)
        document.querySelectorAll('pre[id^="sol"]').forEach(p=>p.style.display='none');