window.addEventListener('load', () => {
    console.log('canvas loaded')
    const canvas = document.querySelector('canvas');
    const resetBtn = document.querySelector('.rbtn')
    const saveBtn = document.querySelector('.sbtn')
    const pval = document.querySelector('.pval')


    function onResize() {
        canvas.width = window.innerWidth / 2;
        canvas.height = window.innerHeight / 2;
    }
    onResize();

    window.addEventListener('resize', onResize);
    ctx = canvas.getContext('2d');
    resetBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    })
    saveBtn.addEventListener('click', onSave)
    let drawing = false;
    function startDraw() {
        drawing = true;
        console.log('starting ')

    }
    function endDraw() {
        drawing = false;
        console.log('ending')
        ctx.beginPath();

    }
    function cDraw(event) {
        if (!drawing) return;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineTo(event.clientX, event.clientY)
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.clientX, event.clientY)


    }
    function onSave() {
        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
        fetch("predict",
            {
                // headers: {
                //     'Accept': 'application/json',
                //     'Content-Type': 'application/json'
                // },
                method: "POST",
                body: image.split(',')[1].trim(),
            }).then(res=>res.json())
            .then((data) => {
                 console.log('herees the data',data)
                 pval.textContent=data['prediction'];
                 })

            .catch((res) => { console.log(res) })
        
    }
    canvas.addEventListener('mousedown', startDraw)
    canvas.addEventListener('mouseup', endDraw)
    canvas.addEventListener('mousemove', cDraw)






})
