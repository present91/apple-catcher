import './style.css'
import Phaser, { Physics, Scene } from 'phaser'

const sizes=
{
    width:450,
    height:450
}

const speedDown=300

class GameScene extends Phaser.Scene
{
    constructor()
    {
        super("scene-game");
        this.player;
        this.cursor;
        this.playerSpeed=speedDown+50;
        this.target;
        this.points=0;
        this.textScore;
        this.lives=3;
        this.textLives;
        this.gameOver=false;
    }
    preload() {
        this.load.image("bg","/assets/bg.png");
        this.load.image("basket","/assets/basket.png");
        this.load.image("apple","/assets/apple.png");
        this.load.image("fg","/assets/fg.png");
    }
    create() {
        this.points=0;
        this.lives=3;
        this.gameOver=false;

        this.add.image(0,0,"fg").setOrigin(0,0).setDisplaySize(sizes.width,sizes.height);
        this.add.image(0,0,"bg").setOrigin(0,0);

        this.player=this.physics.add.image(0,0,"basket").setOrigin(0,-3.5);
        this.player.setImmovable(true);
        this.player.body.allowGravity=false;
        this.player.setCollideWorldBounds(true);
        this.player.setSize(this.player.width*0.5,this.player.height/5).setOffset(this.player.width/4,this.player.height-this.player.height*0.4);

        this.target=this.physics.add.image(0,0,"apple").setOrigin(-2,0);
        this.target.setMaxVelocity(0,speedDown);
        this.physics.add.overlap(this.target,this.player,this.targetHit,null,this)

        this.cursor=this.input.keyboard.createCursorKeys();

        this.textScore=this.add.text(sizes.width-120,10,"Score: 0" , {
            font: "25px Arial",
            fill: "#ff0000ff",
        });

        this.textLives=this.add.text(10,10,"Lives: ♥♥♥", {
            font:"25px Arial",
            fill:"#ff0000"
        });
        this.updateLivesUI();
        this.restartKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }
    update() {
        if(this.gameOver)
        {
            if(Phaser.Input.Keyboard.JustDown(this.restartKey))
                this.scene.restart();
            return;
        }
        if(this.target.y>=sizes.height)
        {
            this.target.setY(0); 
            this.target.setX(this.getRandomX());
            this.lives--;
            this.updateLivesUI();
            if(this.lives<=0)
                this.endGame();
        }
        const {left,right} = this.cursor;
        if(left.isDown) 
            this.player.setVelocityX(-this.playerSpeed);
        else if(right.isDown)
            this.player.setVelocityX(this.playerSpeed);
        else
            this.player.setVelocityX(0);
    }
    getRandomX()
    {
        return Math.floor(Math.random()*360);
    }
    targetHit()
    {
        this.target.setY(0);
        this.target.setX(this.getRandomX());
        this.points++;
        this.textScore.setText(`Score: ${this.points}`)
    }
    endGame()
    {
        this.gameOver=true;

        this.target.setVelocity(0);
        this.target.body.allowGravity=false;

        this.player.setVelocity(0);
        this.player.body.allowGravity=false;

        this.add.text(sizes.width/2,sizes.height/2,"GAME OVER", {
            font:"40px Arial",
            fill:"#000000ff"
        }).setOrigin(0.5);

        this.add.text(sizes.width/2,sizes.height/2+50,"Press R to restart!",
        {
            font:"20px Arial",
            fill:"#000000ff"
        }).setOrigin(0.5);
    }
    updateLivesUI()
    {
        const fullHearts="♥".repeat(this.lives);
        const emptyHearts="♡".repeat(3-this.lives);
        this.textLives.setText("Lives: "+fullHearts+emptyHearts);
    }
}

const config= {
    type:Phaser.WEBGL,
    width:sizes.width,
    height:sizes.height,
    canvas:gameCanvas,
    backgroundColor:"#ffffff",
    physics:
    {
        default:"arcade",
        arcade:
        {
            gravity: {y:speedDown},
            debug:false
        }
    },
    scene: [GameScene]
};

const game=new Phaser.Game(config)