
const Slider = function( el , options ){
    
    const defaults = {
        effect:"slider",
        auto: true,
        autoSpeed: 3000,
        speed:3,
        roundBtns: "move",
        nextPrevBtns: "always", 
        width: 1200,
        height: 450,
        autoHover: false,
        str:[],
    } 
    const _ = {
        slt: (className)=>{
            return document.querySelector(`#${el.id} .${className}`);
        },
        sltID: (idName)=>{
            return document.querySelector(`#${idName}`);
        },
        sltAll: (className)=>{
            return document.querySelectorAll(`#${el.id} .${className}`);
        },
        classNum: (el)=>{
            return parseInt( el.classList[0].split('-')[1] );
        },
        setBox: (target, value)=>{
            const setValue = !value ?`${option.width}px` : `${value}px`;
            target && (target.style.width = setValue) 
            target && (target.style.height = `${option.height}px`)
        }, 
        optional: (name)=>{ 
            return options[name] == undefined ? defaults[name] : options[name];
        },
        addClass: (name, target)=>{
            _.slt(`${name}`) && _.slt(`${name}`).classList.remove(name)
            target && target.classList.add(name) 
        },
        append: ( target )=>{ 
            target.appendChild(target.firstElementChild);
        },
        prepend: ( target )=>{
            target.insertBefore( target.lastElementChild , target.firstElementChild)
        }

    }
    const option ={
        effect:_.optional("effect"),
        auto: _.optional("auto"),
        autoSpeed : _.optional("autoSpeed"),
        speed: _.optional("speed"), 
        roundBtns: _.optional("roundBtns"),
        nextPrevBtns: _.optional("nextPrevBtns"),
        src: _.optional("src"),
        width: _.optional("width"),
        height:_.optional("height"),
        autoHover:_.optional("autoHover"),
        autoFlag:0,
        str:_.optional("str")
    };
   
    const validation= ()=>{
        if(!option.src.length){
            throw new Error("Required option.src");
        }else{
            return true;
        }
    }
     
    const process ={
        makeStr:()=>{
            let str = ``;
            str += `<div class="visual"> 
                    <ul class="img-wrap">`;
            for(let  i=1; i<=options.src.length; i++){
                str += `<li class="img-${i}" style="background-image:url('${option.src[i-1]}')"></li>`
            }
            str += `</ul>
                        <button class="prev-btn"></button>
                        <button class="next-btn"></button>                
                        <ul class="round-btns">`;
            for(let i=1; i<=options.src.length; i++){
                str +=  `<li class="rbtn-${i}"></li>`
            }
            str += `</ul></div>`;
            return str;
        },        
        roundBtns:()=>{    
            let activeEl = 0;
            _.addClass('active'); 
            if( option.effect == 'slider'){
                activeEl =  _.classNum( _.slt('img-wrap').firstElementChild);                            
                activeEl = activeEl == options.src.length ? 1  : activeEl+1; 
            }else{ 
                activeEl = _.classNum(_.slt('stage'));
            }
            _.slt(`rbtn-${activeEl}`).classList.add('active'); 
        },
        styleSet:()=>{ 
            _.setBox(_.sltID(`${el.id}`) ); 
            _.setBox( _.slt('img-wrap li')); 
            _.sltAll('img-wrap li').forEach((v)=>{ _.setBox(v)});
            _.setBox( _.slt('visual'));            
            if( option.effect ==`slider`){
                _.setBox(_.slt('img-wrap') , option.width*option.src.length);
                _.slt('img-wrap').style.transform = `translateX(-${option.width}px)`;
            }
            (option.roundBtns == `readOnly`) && _.slt('round-btns').classList.add('read-only');
            (option.nextPrevBtns == `hoverSlide`) && _.slt('visual').classList.add('hover-slide'); 
            (option.effect == `fadeOut`) &&  _.slt('visual').classList.add('effect-fade-out');            
        }
    }

    if(validation()){ el.innerHTML = process.makeStr(); };

    const eventSlider = {
        next:(e)=>{   
            const imgWrap = _.slt('img-wrap'); 
            _.append(_.slt('img-wrap')); 
            imgWrap.style.transform = `translateX(0px)`;
            imgWrap.style.transition = "none";   
            // next,prev일때만 effect실행
            if(e.target.classList[0].indexOf('round-btn')== -1){   //추후 리팩토링
                eventSlider.nextEffect();
            }                        
        },
        nextEffect:()=>{
            const imgWrap = _.slt('img-wrap'); 
            setTimeout(()=>{
                imgWrap.style.transform = `translateX(-${option.width}px)`;
                imgWrap.style.transition = `all ${option.speed}s ease-in-out`; 
            },10);  
            process.roundBtns();       
        },
        prev:(e)=>{             
            const imgWrap = _.slt('img-wrap'); 
            _.prepend(_.slt('img-wrap'));
            _.slt('img-wrap').style.transform = `translateX(-${option.width*2}px)`;
            _.slt('img-wrap').style.transition = "none"; 
            if(e.target.classList[0].indexOf('round-btn')== -1){   //추후 리팩토링
                eventSlider.prevEffect();
            }                        
        },
        prevEffect:()=>{
            const imgWrap = _.slt('img-wrap'); 
            setTimeout(()=>{
                imgWrap.style.transform = `translateX(-${option.width}px)`;
                imgWrap.style.transition = `all ${option.speed}s ease-in-out`;   
            },10); 
            process.roundBtns();        
        },
        rBtn:(e)=>{
            const targetNum = _.classNum( e.target );
            let slideNum = parseInt(_.classNum( _.slt('img-wrap').firstElementChild )); 
            slideNum = slideNum != option.src.length ? slideNum+1 : 1;    
            if( slideNum < targetNum ){                
                for(let i=slideNum; i<targetNum; i++){
                    _.slt('next-btn').click();                      
                }                        
                eventSlider.nextEffect();
            }else if( slideNum > targetNum){
                for(let i=slideNum; i>targetNum; i--){
                    _.slt('prev-btn').click(); 
                }
                eventSlider.prevEffect();
            } 
        }
    };
    const eventFadeOut = {
        fadeOut:(targetNum)=>{
            _.addClass('up-stage',_.slt(`stage`));  
            _.addClass('stage',_.slt(`img-${targetNum}`));
            setTimeout(()=>{            
                _.addClass('fade-out',_.slt('up-stage'));             
            },200); 
            process.roundBtns();  
        },
        rBtn:(e)=>{ 
            const targetNum = _.classNum( e.target );
            const slideNum = _.classNum(_.slt('stage')); 
            if(slideNum != targetNum){  
                eventFadeOut.fadeOut(targetNum); 
            }
        },
        next:(e)=>{ 
            let targetNum = _.classNum(_.slt('stage'));
            targetNum = targetNum == option.src.length ? 1 : targetNum+1;
            eventFadeOut.fadeOut(targetNum); 
        },  
        prev:(e)=>{
            let targetNum = _.classNum(_.slt('stage'));
            targetNum = targetNum == 1 ? option.src.length : targetNum-1;
            eventFadeOut.fadeOut(targetNum); 
        } 
    };
    let timer = setInterval(()=>{
        _.slt('next-btn').click();  
    },option.autoSpeed) 

    const init = () =>{
        
        if(option.effect == 'fadeOut'){
            _.slt('next-btn').addEventListener('click', eventFadeOut.next );
            _.slt('prev-btn').addEventListener('click', eventFadeOut.prev ); 
            _.addClass('up-stage', _.sltAll('img-wrap li')[0]);  //추후 리펙토링. ['up-stage','stage'] dynamaic parameter
            _.addClass('stage', _.sltAll('img-wrap li')[0]);
        }else{
            _.slt('next-btn').addEventListener('click', eventSlider.next );
            _.slt('prev-btn').addEventListener('click', eventSlider.prev );
            _.prepend(_.slt('img-wrap'));
        }
        if( option.auto && option.autoHover){
            _.slt('visual').addEventListener('mouseenter', ()=>{  
                clearInterval(timer)
                option.autoFlag = 0; 
            });
            _.slt('visual').addEventListener('mouseout', (e)=>{  
                if(option.autoFlag == 0){
                    timer = setInterval(()=>{  _.slt('next-btn').click(); },option.autoSpeed);
                    option.autoFlag =1;
                } 
            });
        }

        if( option.roundBtns && option.roundBtns != "readOnly"){ 
            if(option.effect == 'slider'){
                _.sltAll('round-btns li')
                .forEach(
                    (li)=>{ li.addEventListener('click',(e)=>{ eventSlider.rBtn(e) })
                });
            }else{
                _.sltAll('round-btns li')
                .forEach(
                    (li)=>{ li.addEventListener('click',(e)=>{ eventFadeOut.rBtn(e) })
                });
            } 
        }       
        _.slt('round-btns li').classList.add('active');        
        process.styleSet(); 
        !option.auto && clearInterval(timer);         
    } 
    console.log('aa test');
   
    init();
    window.onbeforeunload = function(e){
        window.clearInterval(timer); 
    }
}


console.log('test');

const el = document.querySelector(`#slider`);
console.log(el);
const slider = new Slider(el, {
   auto:false,
     src:[
        "./img/0.png","./img/1.png"
        ,"./img/2.png","./img/3.png"
        ,"./img/4.png","./img/5.png"
        ,"./img/6.png" 
     ],
});
console.log(slider);

const el2 = document.querySelector(`#slider_second`);
const slider2 = new Slider(el2, {
     effect:"fadeOut",
     auto: false,
     autoSpeed: 1000,
     speed:.6,
     nextPrevBtns: "hoverSlide",
  src:[
       "./img/3.png","./img/1.png",
       "./img/2.png","./img/6.png",
       "./img/4.png","./img/5.png"
  ],
     width: 800, 
     
});