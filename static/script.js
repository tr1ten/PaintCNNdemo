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
    ctx = canvas.getContext('2d');
    function resetCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', onResize);
    resetBtn.addEventListener('click', resetCanvas)
    saveBtn.addEventListener('click', onSave)
    let drawing = false;
    function startDraw() {
        drawing = true;
        console.log('starting ')
        cDraw()

    }

    function cDraw(event) {
        if (!drawing) return;
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.lineTo(event.clientX, event.clientY)
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.clientX, event.clientY)


    }
    const draw = function (x, y) {

        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.lineTo(x, y)
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y)


        // ctx.closePath();
    };

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
            }).then(res => res.json())
            .then((data) => {
                // console.log('herees the data', data)
                pval.textContent = data['prediction'];
                resetCanvas();

            })

            .catch((res) => { console.log(res) })

    }
    function endDraw() {
        drawing = false;
        console.log('ending')
        ctx.beginPath();
        onSave()

    }

    canvas.addEventListener('mousedown', startDraw)
    // canvas.addEventListener('touchstart', handleStart,false)
    canvas.addEventListener('mouseup', endDraw)
    // canvas.addEventListener('touchend', handlerEnd,false)
    canvas.addEventListener('mousemove', cDraw)
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();

        for (let touches of e.changedTouches) {

            draw(touches.pageX, touches.pageY);
        }
        // draw(e.changedTouches[1].pageX, e.changedTouches[1].pageY);
    });
    canvas.addEventListener('touchend', function (e) {
        e.preventDefault();

        ctx.beginPath();
        // draw(e.changedTouches[1].pageX, e.changedTouches[1].pageY);
    });








})
