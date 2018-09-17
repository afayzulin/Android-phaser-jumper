var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 500,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
};

var game = new Phaser.Game(config);
var player;
var score = 0;
var scoreText;

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create ()
{

    this.add.image(400, 300, 'sky');
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 500, 'ground').setScale(2).refreshBody();

    platforms.create(500, 400, 'ground');
    platforms.create(0, 250, 'ground');
    platforms.create(550, 220, 'ground');

    player = this.physics.add.sprite(100, 400, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 15, y: 0, stepX: 30 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

var right = document.getElementById('right_btn');

right.ontouchstart = startTouchRight;
function startTouchRight()
{
   cursors.right.isDown = true;
}

right.ontouchend  = CancelTouchRight;
function CancelTouchRight()
{
  cursors.right.isDown = false;
}

var up = document.getElementById('up_btn');

up.ontouchstart = startTouchUp;
function startTouchUp()
{
   cursors.up.isDown = true;
}

up.ontouchend  = cancelTouchUp;
function cancelTouchUp()
{
  cursors.up.isDown = false;
}

var left = document.getElementById('left_btn');

left.ontouchstart = startTouchLeft;
function startTouchLeft()
{
   cursors.left.isDown = true;
}

left.ontouchend  = cancelTouchLeft;
function cancelTouchLeft()
{
  cursors.left.isDown = false;
}



function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

var restart = document.getElementById('restart_btn');
restart.onclick = function()
{
    window.location.reload();
}