<template>
    <div class="regist-wrap">
        <entry v-if="entryHomeStatus" :renderData="entryData"></entry>
        <div class="regist-topbar">
            <router-link to="/login" tag="h4" style="cursor: pointer;">保世界管理后台 </router-link>
        </div>
        <div class="regist-form-wrap">
            <h5>企业注册</h5>
            <el-steps :active="active" finish-status="success" class="step-wrap">
                <el-step title="填写手机号"></el-step>
                <el-step title="完善信息"></el-step>
                <el-step title="注册成功"></el-step>
            </el-steps>
            <el-form class="first-step-wrap" v-show="active==1" :label-position="labelPosition" label-width="100px" :model="formFirst" :rules="formFirstRule" ref="formFirst">
                <el-form-item label="手机号" prop="tel">
                    <el-input v-model="formFirst.tel" @change="handlePhoneChange"></el-input>
                </el-form-item>
                <el-form-item label="图片验证码" prop="picCode">
                    <el-input v-model="formFirst.picCode" class="code-input"></el-input>
                    <div class="pic-code" @click="refreshCaptchaCode"><img :src="captchaCode"></div>
                </el-form-item>
                <el-form-item label="短信验证码" prop="msgCode">
                    <el-input v-model="formFirst.msgCode" class="code-input" ></el-input>
                     <div class="msg-code-btn"><send-msg-code :sendMsgData="sendMsgData"></send-msg-code></div>
                </el-form-item>
                <el-button class="next-btn" type="primary" @click="handleSubmitFirst('formFirst')">下一步</el-button>
            </el-form>
            <el-form class="second-step-wrap" v-show="active==2"  :label-position="labelPosition" label-width="134px" :model="formSecond" :rules="formSecondRule" ref="formSecond">
                
                <el-form-item label="企业（团队）名称" prop="comName">
                    <el-input v-model="formSecond.comName" placeholder="请输入企业（团队）名称"></el-input>
                </el-form-item>

                <el-form-item label="企业类型" prop="comType">
                    <el-select style="width:386px" v-model="formSecond.comType" placeholder="请选择企业类型" :loading="comTypeLoading" @visible-change="comTypeOptionShow" @change="comTypeChange">
                        <el-option
                            v-for="item in comTypeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="所属保险公司" prop="insurance" v-show="!notInsuranceCompany">
                    <el-select style="width:386px" v-model="formSecond.insurance" filterable placeholder="请选择保险公司"
                    :loading="comInsurLoading" @visible-change="comInsurOptionShow" @change="comInsurChange"
                    >
                        <el-option
                        v-for="item in comInsurOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                <!-- <el-autocomplete
                    :disabled="notInsuranceCompany"
                    style="width:385px"
                    v-model="formSecond.insurance"
                    :fetch-suggestions="insuranceSearch"
                    placeholder="请输入保险公司"
                    @select="handleSelectInsurance"
                    ></el-autocomplete> -->
                </el-form-item>

                <el-form-item label="所在地"  prop="location">
                    <city-select v-model="formSecond.location"></city-select>
                </el-form-item>

                <el-form-item label="人员规模" prop="comNums"> 
                    <el-select v-model="formSecond.comNums" placeholder="请选择人员规模" style="width:385px">
                    <el-option
                        v-for="item in comNumsOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="管理员姓名" prop="adminName">
                    <el-input v-model="formSecond.adminName" placeholder="请输入管理员姓名"></el-input>
                </el-form-item>

                <el-form-item label="管理员密码" prop="password" >
                    <el-input v-model="formSecond.password" type="password" auto-complete="off" placeholder="数字字母组合，长度不低于8位"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formSecond.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>

                <el-form-item label="" class="clearfix" prop="agree">
                    <el-checkbox v-model="formSecond.agree" style="float:left">我同意</el-checkbox>
                    <div class="agreement" @click="agreementDialogVisible = true">《保世界平台服务协议》</div>
                </el-form-item>
                <el-button class="next-btn" type="primary" @click="handleSubmitSecond('formSecond')">创建企业（团队）</el-button>

            </el-form>
            <el-form class="third-step-wrap" v-show="active==3" :label-position="labelPosition" label-width="80px">
                <div class="success"><span>创建成功</span></div>
                <!-- <el-button class="next-btn" type="primary" @click="handleSubmitThird">自动登录中....</el-button> -->
            </el-form>
            
        </div>
        <el-dialog
            title="保世界服务协议"
            :visible.sync="agreementDialogVisible"
            width="800px"
            center>
           <div class="regist-rules-body"><p><br></p><p style="margin-left: 0;text-indent: 0"><strong><span >&#8203;首部及导言</span></strong></p><p style="margin-left: 0;text-indent: 0"><span >欢迎</span><span >您</span><span >使用</span><span >郑州聪保网络技术有限公司旗下产品</span><span >保世界软件及相关服务！</span></p><p style="margin-left: 0;text-indent: 0"><strong><span >【审慎阅读】您在申请注册流程中点击同意保世界服务协议（以下简称本协议）之前，请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款。以及开通或使用某项服务的单独协议，并选择接受或不接受。限制、免责条款可能以加粗形式提示</span></strong><strong><span >您</span></strong><strong><span >注意。</span></strong></p><p style="margin-left: 0;text-indent: 0"><strong><span >当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，或您按照激活页面提示填写信息、阅读并同意本协议且完成全部激活程序后，即表示您已充分阅读、理解并接受本协议的全部内容，本协议即产生法律约束力。</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><strong><span >如您对协议有任何疑问，可向保世界平台客服咨询</span></strong><strong><span >（</span></strong><span >电子邮箱：</span><span style="font-size: 14px">kefu@inswindows.com</span><strong><span >），或者</span></strong><span >通过</span><span >移动端</span><span >-我的-</span><span >意见反馈</span><span ><span >或</span>7*12小时客服热线（</span><span >0371-</span><span style="font-size: 14px">55001255</span><span >）</span><span >与我们联系</span><strong><span >。</span></strong></p><p style="margin-left: 0;text-indent: 0"><strong><span >一、协议的范围</span></strong></p><p style="margin-left: 0;text-indent: 0"><span >协议适用主体范围</span></p><p style="margin-left: 0;text-indent: 0"><span ><span >本协议由通过保世界网站、移动客户端软件及其他方式使用保世界服务的用户（以下简称</span>“用户”或“您”）与</span><span >郑州聪保网络技术有限公司</span><span >共同缔结，关于您下载、安装、使用、复制本软件，以及使用保世界相关服务所订立的协议。</span></p><p style="margin-left: 0;text-indent: 0"><span style="letter-spacing: 0;font-weight: bold;font-size: 14px">二、</span><strong><span >协议内容和效力</span></strong><strong></strong></p><p><span >2.1、本协议内容包括本协议正文及所有保世界已经发布或将来可能发布的隐私政策、各项政策、规则、声明、通知、警示、提示、说明（以下简称“规则”）。前述规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。</span></p><p><span >2.2、保世界有权根据需要不时制订、修改本协议及相关规则，变更后的协议和规则一经公布，立即取代原协议及规则并自动生效。如您不同意相关变更，应当立即停止使用保世界服务，如您继续使用保世界服务或进行任何网站活动，即表示您已接受经修订的协议和规则。</span></p><p><strong><span >三、服务内容</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><span >3.1、保世界提供的</span><span >移动端包括</span><span >iOS和Android版本等各种形式服务软件，保世界会不断丰富您使用本服务的终端、形式等。</span></p><p style="margin-left: 0;text-indent: 0"><span >3.2、</span><span >您</span><span >可以为使用本软件及服务的目的复制本软件的一个副本，仅用作备份。备份副本必须包含原软件中含有的所有著作权信息。</span></p><p style="margin-left: 0;text-indent: 0"><span >3.3、</span><span >您</span><span >使用本服务需要注册帐号并下载保世界客户端软件，我们将向</span><span >您</span><span >提供保世界</span><span >相应</span><span >的管理权限、使用功能和使用说明等服务，并尽应有之努力保障本服务的正常运行。</span></p><p style="margin-left: 0;text-indent: 0"><span >3.4、本服务内容包含支持通讯录、消息未读列表等技术功能，这些功能服务可能根据用户需求的变化，随着因服务版本不同或服务提供方的单方判断而被优化或修改，或因定期、不定期的维护而暂缓提供。</span></p><p style="margin-left: 0;text-indent: 0"><span >3.5、同时，保世界保留在任何时候自行决定对服务或服务任何部分及其相关功能、应用软件变更、升级、修改、转移的权利。您同意，对于上述行为，保世界均不需通知，并且对您和任何第三人不承担任何责任。</span></p><p style="margin-left: 0;text-indent: 0"><span >3.6、本条及本协议其他条款未明示授权的其他一切权利仍由保世界保留，您在行使这些权利时须另外取得保世界的书面许可。保世界如果未行使前述任何权利，并不构成对该权利的放弃。</span></p><p style="margin-left: 0;text-indent: 0"><strong><span >&nbsp;</span></strong></p><p style="margin-left: 0;text-indent: 0"><strong><span >四、注册及账号管理</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><span >4.1、您确认，在您完成注册程序或以其他保世界允许的方式实际使用服务时，您应当是具备完全民事权利能力和与所从事的民事行为相适应的行为能力的自然人、法人或其他组织。若您不具备前述主体资格，请勿使用服务，否则您及您的监护人应承担因此而导致的一切后果，且保世界有权注销（永久冻结）您的账户，并向您及您的监护人索偿。如您代表一家公司或其他法律主体进行注册或以其他保世界允许的方式实际使用本服务，则您声明和保证，您有权使该公司或该法律主体受本协议“条款“的约束。</span></p><p style="margin-left: 0;text-indent: 0"><span >4.2、您注册时应提交真实、准确、完整和反映当前情况的身份及其他相关信息，同时系统将为</span><span >您</span><span >自动分配一个保世界号，</span><span >您</span><span >可以对保世界号进行设置，但仅可以设置一次，设置保世界号后将无法修改。</span><span >您</span><span >理解并同意，您承诺注册的账号名称、设置的保世界号、头像和简介等信息中不得出现违法和不良信息，不得冒充他人，不得未经许可为他人注册，不得以可能导致其他用户误认的方式注册账号或设置保世界号，不得使用可能侵犯他人权益的用户名（包括但不限于涉嫌商标权、名誉权侵权等），否则保世界有权不予注册或停止服务并收回账号及保世界号，因此产生的损失由您自行承担。</span></p><p style="margin-left: 0;text-indent: 0"><span >4.3、您了解并同意，保世界注册账号（包括客户端账号及服务管理账号）所有权归属于保世界，注册完成后，您仅获得账号使用权。保世界账号使用权仅归属于初始申请注册人，不得以任何方式转让或被提供予他人使用，否则，保世界有权立即不经通知收回该账号，由此带来的因您使用本服务产生的全部数据、信息等被清空、丢失等的损失，您应自行承担。</span></p><p style="margin-left: 0;text-indent: 0"><span >4.4、在您成功注册后，保世界将根据账号和密码确认您的身份。您应妥善保管您的终端及账户和密码，并对利用该账户和密码所进行的一切活动（包括但不限于网上点击同意或提交各类规则协议或购买服务、分享资讯或图片等）负全部责任。您承诺，在密码或账户遭到未获授权的使用，或者发生其他任何安全问题时，将立即通知保世界，且您同意并确认，保世界不对上述情形产生的任何直接或间接的遗失或损害承担责任。除非有法律规定或司法裁定，且征得保世界的同意，否则，您的账户、密码不得以任何方式转让、赠与或继承（与账户相关的财产权益除外）。</span></p><p style="margin-left: 0;text-indent: 0"><span >4.5、</span><strong><span ><span >您了解并同意，如您注册保世界账号后连续超过</span>12个月未登录，保世界为网站优化管理之目的有权回收该账号，相关问题及责任均由您自行承担。</span></strong></p><p style="margin-left: 0;text-indent: 0"><span >4.6、</span><strong><span >保世界</span></strong><strong><span >根据本协议收回或取消账号后，有权自行对账号相关内容及信息以包括但不限于删除等方式进行处理，且无需就此向用户承担任何责任；如果账号为管理员账号，</span></strong><strong><span >保世界</span></strong><strong><span >有权取消和删除该管理员账号以及通信录成员基于该企业的一切信息和相关权益，包括但不限于解除与企业之间的服务关系、解散企业通信录、取消通信录成员与该企业相关的权益、删除管理员账号中的所有信息、删除企业通信录成员基于企业的所有信息等。</span></strong></p><p style="margin-left: 0;text-indent: 0"><span >&nbsp;</span></p><p style="margin-left: 0;text-indent: 0"><strong><span >五、服务使用规范</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><span >5.1、用户充分了解并同意，保世界仅为用户提供服务平台，您应自行对利用服务从事的所有行为及结果承担责任。相应地，您应了解，使用保世界服务可能发生来自他人非法或不当行为（或信息）的风险，您应自行判断及行动，并自行承担相应的风险。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.2、您应自行承担因使用服务所产生的费用，包括但不限于上网流量费、通信服务费等。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.3、除非另有说明，本协议项下的服务只能用于非商业用途。您承诺不对本服务任何部分或本服务之使用或获得，进行复制、拷贝、出售、转售或用于包括但不限于广告及任何其它商业目的。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4、您承诺不会利用本服务进行任何违法或不当的活动，包括但不限于下列行为:</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.1上载、传送或分享含有下列内容之一的信息：</span></p><p style="margin-left: 0;text-indent: 0"><span >(a) 反对宪法所确定的基本原则的；</span></p><p style="margin-left: 0;text-indent: 0"><span >(b) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</span></p><p style="margin-left: 0;text-indent: 0"><span >(c) 损害国家荣誉和利益的；</span></p><p style="margin-left: 0;text-indent: 0"><span >(d) 煽动民族仇恨、民族歧视、破坏民族团结的；</span></p><p style="margin-left: 0;text-indent: 0"><span >(e) 破坏国家宗教政策，宣扬邪教和封建迷信的；</span></p><p style="margin-left: 0;text-indent: 0"><span >(f) 散布谣言，扰乱社会秩序，破坏社会稳定的；</span></p><p style="margin-left: 0;text-indent: 0"><span >(g) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</span></p><p style="margin-left: 0;text-indent: 0"><span >(h) 侮辱或者诽谤他人，侵害他人合法权利的；</span></p><p style="margin-left: 0;text-indent: 0"><span >(i) 含有虚假、诈骗、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；</span></p><p style="margin-left: 0;text-indent: 0"><span >(j) 含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.2、</span><span >冒充任何人或机构，或以虚伪不实的方式陈述或谎称与任何人或机构有关；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.3、伪造标题或以其他方式操控识别资料，使人误认为该内容为保世界或其关联公司所传送；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.4、将依据任何法律或合约或法定关系（例如由于雇佣关系和依据保密合约所得知或揭露之内部资料、专属及机密资料）知悉但无权传送之任何内容加以上载、传送或分享；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.5、将涉嫌侵害他人权利（包括但不限于著作权、专利权、商标权、商业秘密等知识产权）之内容上载、传送或分享；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.6、跟踪或以其它方式骚扰他人, 或通过本服务向好友或其他用户发送大量信息；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.7、将任何广告、推广信息、促销资料、“垃圾邮件”、“滥发信件”、“连锁信件”、“直销”或其它任何形式的劝诱资料加以上载、传送或分享，供前述目的使用的专用区域或专用功能除外；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.8、因本服务并非为某些特定目的而设计，您不可将本服务用于包括但不限于核设施、军事用途、医疗设施、交通通讯等重要领域。如果因为软件或服务的原因导致上述操作失败而带来的人员伤亡、财产损失和环境破坏等，保世界不承担法律责任；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.9、出于超出正常好友或用户之间内部或外部信息沟通、交流等目的（包括但不限于为发送广告、垃圾、骚扰或违法违规等信息的目的），通过自己添加或诱导他人添加等任何方式使自己与其他用户形成好友关系（好友关系包括但不限于单向好友关系和双向好友关系，下同），通过本服务向好友或其他用户发送大量信息；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.10、违反遵守法律法规、社会主义制度、国家利益、公民合法利益、公共秩序、社会道德风尚和信息真实性等“七条底线”要求的行为；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.4.11、从事任何违反中国法律、法规、规章、政策及规范性文件的行为。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.5、您承诺不对本软件和服务从事以下行为：</span></p><p style="margin-left: 0;text-indent: 0"><span >5.5.1、将有关干扰、破坏或限制任何计算机软件、硬件或通讯设备功能的软件病毒或其他计算机代码、档案和程序之资料，加以上载、张贴、发送电子邮件或以其他方式传送；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.5.2、干扰或破坏本服务或与本服务相连线之服务器和网络，或违反任何关于本服务连线网络之规定、程序、政策或规范；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.5.3、通过修改或伪造软件运行中的指令、数据，增加、删减、变动软件的功能或运行效果，或者将用于上述用途的软件、方法进行运营或向公众传播，无论这些行为是否为商业目的；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.5.4、通过非保世界开发、授权的第三方软件、插件、外挂、系统，登录或使用软件及服务，或制作、发布、传播上述工具；</span></p><p style="margin-left: 0;text-indent: 0"><span >5.5.5、自行、授权他人或利用第三方软件对本软件及其组件、模块、数据等进行干扰。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.6、您承诺，使用保世界服务时您将严格遵守本协议(包括本协议第一条所述规则)。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.7、</span><span >您同意并接受</span><span >保世界</span><span >无须时时监控您上载、传送或分享的资料及信息，但</span><span >保世界</span><span >有权对您使用服务的情况进行审查、监督并采取相应行动，包括但不限于删除信息、中止或终止服务，及向有关机关报告。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.8、您承诺不以任何形式使用本服务侵犯保世界的商业利益，或从事任何可能对保世界造成损害或不利于保世界的行为。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.</span><span >9</span><span >、如您申请服务管理账号，则应自行通过账号添加和管理成员，并对管理成员的行为自行承担责任，保世界根据您</span><span >通过</span><span >服务管理账号的行为对成员服务的调整亦由您承担后果，因此给保世界或他人造成损失的，您应当予以赔偿。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.</span><span >10</span><span >、您充分了解并同意，您必须为自己</span><span >的</span><span >注册帐号下的一切行为负责，包括您所发表的任何内容以及由此产生的任何后果。您应对使用本服务时接触到的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。保世界无法且不会对您因前述风险而导致的任何损失或损害承担责任。</span></p><p style="margin-left: 0;text-indent: 0"><span >5.1</span><span >1</span><span >、如果保世界发现或收到他人举报您有违反本协议约定的，保世界有权不经通知随时对相关内容进行删除、屏蔽，并采取包括但不限于收回账号，限制、暂停、终止您使用部分或全部本服务，追究法律责任等措施。</span></p><p style="margin-left: 0;text-indent: 0"><span >&nbsp;</span></p><p style="margin-left: 0;text-indent: 0"><strong><span >六、服务费用</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><span >6.1、保世界</span><span ><span >保留本软件的任何服务或功能后续收费的权利。保世界有权提前</span>7个工作日以公告形式通知你收费标准，如你不同意收费应当立即停止服务的使用，否则若你继续使用则需按保世界公布的收费标准支付费用。</span></p><p style="margin-left: 0;text-indent: 0"><span >6.2、所有费用需通过保世界接受的支付方式事先支付。前述使用费不包含其它任何税款、费用或相关汇款等支出，否则您应补足付款或自行支付该费用。</span></p><p><strong><span >&nbsp;</span></strong></p><p><strong><span >七、特别授权</span></strong><strong></strong></p><p><span >7.1、当您向保世界关联公司作出任何形式的承诺，且相关公司已确认您违反了该承诺，则保世界有权立即按您的承诺约定的方式对您的账户采取限制措施，包括但不限于中止或终止向您提供服务，并公示相关公司确认的您的违约情况。您了解并同意，保世界无须就相关确认与您核对事实，或另行征得您的同意，且保世界无须就此限制措施或公示行为向您承担任何的责任。</span></p><p style="margin-left: 0;text-indent: 0"><span >7.2、一旦您违反本协议，或与保世界签订的其他协议的约定，保世界有权以任何方式通知</span><span >保世界</span><span >关联公司，要求其对您的权益采取限制措施，包括但不限于要求保世界关联公司中止、终止对您提供部分或全部服务，且在其经营或实际控制的任何网站公示您的违约情况。</span></p><p style="margin-left: 0;text-indent: 0"><span >&nbsp;</span></p><p style="margin-left: 0;text-indent: 0"><strong><span >八、第三方应用</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><span >8.1、保世界允许第三方应用接入服务平台，您可以在保世界直接获得包括但不限于OA软件等第三方应用服务。您了解并同意，保世界仅作为平台提供者，相关应用由该第三方独立提供，保世界不对您对该应用的使用承担任何责任。</span></p><p style="margin-left: 0;text-indent: 0"><span >&nbsp;</span></p><p style="margin-left: 0;text-indent: 0"><span >8.2、您了解并同意，如保世界对服务或其部分做出调整、中止或终止而对第三方应用服务产生影响，保世界不承担任何责任。</span></p><p style="margin-left: 0;text-indent: 0"><span >8.3、您通过第三方应用或服务使用保世界时，可能会调用第三方系统或者通过第三方支持您的使用或访问，使用或访问的结果由该第三方提供。</span></p><p style="margin-left: 0;text-indent: 0"><span >&nbsp;</span></p><p style="margin-left: 0;text-indent: 0"><span style="letter-spacing: 0;font-weight: bold;font-size: 14px">九、</span><strong><span >服务中止或终止</span></strong><strong></strong></p><p><span >9.1、您同意，鉴于互联网服务的特殊性，保世界有权随时中止、终止或致使中止终止服务或其任何部分；对于免费服务之中止或终止，保世界无需向您发出通知。</span></p><p><span >9.2、您了解并同意，保世界可能定期或不定期地对提供网络服务的平台设备、设施和软硬件进行维护或检修，如因此类情况而造成收费服务在合理时间内中止，保世界无需承担责任，但应尽可能事先进行通告。</span></p><p><span >9.3、如存在下列违约情形之一，保世界可立即对用户中止或终止服务，并要求用户赔偿损失：</span></p><p><span >9.3.1、用户违反第四条之注册义务；</span></p><p><span >9.3.2、 用户使用收费网络服务时未按规定支付相应服务费；</span></p><p><span >9.3.3、用户违反第五条服务使用规范之规定。</span></p><p><strong><span >&nbsp;</span></strong></p><p style="margin-left: 0;text-indent: 0"><span style="letter-spacing: 0;font-weight: bold;font-size: 14px">十、</span><strong><span >隐私政策</span></strong><strong></strong></p><p><span >10.1、您在</span><span >保世界</span><span >服务注册的账户具有密码保护功能，以确保您基本信息资料的安全，请您妥善保管账户及密码信息。</span></p><p><span >10.2、保世界努力采取各种合理的物理、电子和管理方面的安全措施来保护您的信息，使您存储在保世界中的信息和通信内容不会被泄漏、毁损或者丢失，包括但不限于SSL、信息加密存储、数据中心的访问控制。我们对可能接触到信息的员工或外包人员也采取了严格管理，包括但不限于根据岗位的不同采取不同的权限控制，与他们签署保密协议，监控他们的操作情况等措施。保世界会按现有技术提供相应的安全措施来保护您的信息，提供合理的安全保障，保世界将在任何时候尽力做到使您的信息不被泄漏、毁损或丢失，但同时也请您注意在信息网络上不存在绝对完善的安全措施，请妥善保管好相关信息。</span></p><p><span >10.3、保世界有权根据实际情况自行决定您在本软件及服务中数据的最长储存期限、服务器中数据的最大存储空间等，您应当保管好终端、账号及密码，并妥善保管相关信息和内容，保世界对您自身原因导致的数据丢失或被盗以及在本软件及服务中相关数据的删除或储存失败不承担责任。</span></p><p style="margin-left: 0;text-indent: 0"><span >&nbsp;</span></p><p style="margin-left: 0;text-indent: 0"><strong><span >十一、知识产权声明</span></strong></p><p style="margin-left: 0;text-indent: 0"><span >11.1 保世界是本软件的知识产权权利人。本软件的一切著作权、商标权、专利权、商业秘密等知识产权，以及与本软件相关的所有信息内容（包括但不限于文字、图片、音频、视频、图表、界面设计、版面框架、有关数据或电子文档等）均受中华人民共和国法律法规和相应的国际条约保护，相关权利人依照法律规定应享有的权利除外。</span></p><p style="margin-left: 0;text-indent: 0"><span >11.2、未经保世界或相关权利人书面同意，</span><span >您</span><span >不得为任何商业或非商业目的自行或许可任何第三方实施、利用、转让上述知识产权。</span></p><p style="margin-left: 0;text-indent: 0"><span >11.3、保世界服务涉及的Logo、“保世界”等文字、图形及其组成，以及保世界其他标识、徵记、产品和服务名称均为保世界及其关联公司在中国和其它国家的商标，用户未经保世界书面授权不得以任何方式展示、使用或作其他处理，也不得向他人表明您有权展示、使用、或作其他处理。</span></p><p style="margin-left: 0;text-indent: 0"><span >&nbsp;</span></p><p style="margin-left: 0;text-indent: 0"><strong><span >十二、有限责任</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><span >12.1、服务将按"现状"和按"可得到"的状态提供。保世界在此明确声明对服务不作任何明示或暗示的保证，包括但不限于对服务的可适用性，没有错误或疏漏，持续性，准确性，可靠性，适用于某一特定用途之类的保证，声明或承诺。</span></p><p style="margin-left: 0;text-indent: 0"><span >12.2、保世界对服务所涉的技术和信息的有效性，准确性，正确性，可靠性，质量，稳定，完整和及时性均不作承诺和保证。</span></p><p style="margin-left: 0;text-indent: 0"><span >12.3、不论在何种情况下，保世界均不对由于Internet连接故障，电脑，通讯或其他系统的故障，电力故障，罢工，劳动争议，暴乱，起义，骚乱，生产力或生产资料不足，火灾，洪水，风暴，爆炸，不可抗力，战争，政府行为，国际、国内法院的命令或第三方的不作为而造成的不能服务或延迟服务承担责任。</span></p><p style="margin-left: 0;text-indent: 0"><span >12.4、不论是否可以预见，不论是源于何种形式的行为，保世界不对由以下原因造成的任何特别的，直接的，间接的，惩罚性的，突发性的或有因果关系的损害或其他任何损害（包括但不限于利润或利息的损失，营业中止，资料灭失）承担责任。</span></p><p style="margin-left: 0;text-indent: 0"><span >12.4.1、使用或不能使用服务；</span></p><p style="margin-left: 0;text-indent: 0"><span >12.4.2、通过服务购买或获取任何产品，样品，数据，信息或进行交易等，或其他可替代上述行为的行为而产生的费用；</span></p><p style="margin-left: 0;text-indent: 0"><span >12.4.3、未经授权的存取或修改数据或数据的传输；</span></p><p style="margin-left: 0;text-indent: 0"><span >12.4.4、第三方通过服务所作的陈述或行为；</span></p><p style="margin-left: 0;text-indent: 0"><span >12.4.5.、其它与服务相关事件，包括疏忽等，所造成的损害。</span></p><p style="margin-left: 0;text-indent: 0"><span >12.5、您充分了解并同意，鉴于互联网体制及环境的特殊性，您在服务中分享的信息及个人资料有可能会被他人复制、转载、擅改或做其它非法用途；您在此已充分意识此类风险的存在，并确认此等风险应完全由您自行承担，</span><span >保世界</span><span >对此不承担任何责任。</span></p><p style="margin-left: 0;text-indent: 0"><span >12.6、您了解并同意，在使用服务过程中可能存在来自任何他人的包括威胁性的、诽谤性的、令人反感的或非法的内容或行为或对他人权利的侵犯（包括知识产权）及匿名或冒名的信息的风险，基于服务使用规范所述，该等风险应由您自行承担，保世界对此不承担任何责任。</span></p><p style="margin-left: 0;text-indent: 0"><strong><span >&nbsp;</span></strong></p><p style="margin-left: 0;text-indent: 0"><span style="letter-spacing: 0;font-weight: bold;font-size: 14px">十三、</span><strong><span >违约责任及赔偿</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><span >13.1、</span><span >如果保世界发现或收到他人举报您有违反本协议约定的，保世界有权不经通知随时对相关内容进行删除、屏蔽，并采取包括但不限于限制、暂停、终止您使用保世界账号及服务，限制、暂停、终止您使用部分或全部本服务（包括但不限于解除与团体或成员的所属关系，删除通信录、限制增加成员、限制发送消息或添加好友等），追究法律责任等措施。</span></p><p style="margin-left: 0;text-indent: 0"><span >13.2、您同意，由于您通过服务上载、传送或分享之信息、使用本服务其他功能、违反本协议、或您侵害他人任何权利因而衍生或导致任何第三人向保世界及其关联公司提出任何索赔或请求，或保世界及其关联公司因此而发生任何损失，您同意将足额进行赔偿（包括但不限于合理律师费）。</span></p><p style="margin-left: 0;text-indent: 0"><span >&nbsp;</span></p><p style="margin-left: 0;text-indent: 0"><span style="letter-spacing: 0;font-weight: bold;font-size: 14px">十四、</span><strong><span >有效通知</span></strong><strong></strong></p><p><span >14.1、保世界向您发出的任何通知，可采用电子邮件、页面公开区域公告、个人网络区域提示、手机短信或常规信件等方式，且该等通知应自发送之日视为已向用户送达或生效。</span></p><p><span >14.2、您同意，您向保世界发出的任何通知应发至保世界对外正式公布或以</span><span >公告</span><span >方式告知用户的电子邮件、通信地址、传真号码等联系信息，或使用其他保世界认可的其他通知方式进行送达。</span></p><p><span >&nbsp;</span></p><p><strong><span >十五、争议解决及其他</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><span >15.1、本协议之解释与适用，以及与本协议有关的争议，均应依照中华人民共和国法律予以处理，并以</span><span style="font-size:14px">河南省郑州市</span><span style="font-size:14px">高新区</span><span >人民法院为第一审管辖法院。</span></p><p style="margin-left: 0;text-indent: 0"><span >15.2、如本协议的任何条款被视作无效或无法执行，则上述条款可被分离，其余</span><span >部分</span><span >则仍具有法律效力。</span></p><p style="margin-left: 0;text-indent: 0"><span >15.3、保世界于用户过失或违约时放弃本协议规定的权利的，不得视为其对用户的其他或以后同类之过失或违约行为弃权。</span></p><p style="margin-left: 0;text-indent: 0"><span >15.4、本协议应取代双方此前就本协议任何事项达成的全部口头和书面协议、安排、谅解和通信。</span></p><p><strong><span >15.5、若您和保世界之间发生任何纠纷或争议，首先应友好协商解决；协商不成的，</span></strong><strong><span >您</span></strong><strong><span >同意将纠纷或争议提交本协议</span></strong><strong><span >约定的</span></strong><strong><span >有管辖权的人民法院管辖。</span></strong><strong></strong></p><p style="margin-left: 0;text-indent: 0"><span >15.6、保世界有权根据业务调整情况将本协议项下的全部权利义务一并转移给其关联公司，转让将以本协议规定的方式通知，用户承诺对此不持有异议。</span><span >（正文完）</span></p><p style="margin-left: 0;text-indent: 0"><span >&nbsp;</span></p><p style="text-align:right"><span style=";;font-size:14px">保世界</span></p><p><br></p></div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="centerDialogVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="agreementDialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
            <!-- 下载保世界app激活账号提示 -->
            <el-dialog
                class="down-qrcode-wrap"
                title="提示"
                :visible.sync="downAppDialogVisible"
                width="520px"
                center>
                <div style="text-align:center;line-height:40px">您尚未注册，请下载保世界app注册账号后再继续完成创建</div>
                <el-form :label-position="labelPosition" label-width="100px" :model="formRegist" :rules="formRegistRule" ref="formRegist">
                <el-form-item label="手机号" prop="tel">
                    <el-input v-model="formRegist.tel" :disabled="true" class="code-input"></el-input>
                </el-form-item>
                <el-form-item label="短信验证码" prop="msgCode">
                    <el-input v-model="formRegist.msgCode" class="code-input" auto-complete="off" placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="pass">
                    <el-input v-model="formRegist.pass" class="code-input" type="password" auto-complete="off" placeholder="8-16位字母数字组合"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="repass">
                    <el-input v-model="formRegist.repass" class="code-input" type="password" auto-complete="off" placeholder="8-16位字母数字组合"></el-input>
                </el-form-item>
                <el-form-item label="" class="regist-checked" prop="checked">
                    <el-checkbox label="同意" v-model="formRegist.checked">我同意</el-checkbox>
                    <div class="clause-wrap"><i @click="showServiceDialog=true">《保世界服务协议》</i><i @click="showPrivacyDialog=true">《隐私协议》</i></div>
                </el-form-item>
                
                <el-button class="next-btn" type="primary" @click="handleRegist('formRegist')">确定</el-button>
            </el-form>
            </el-dialog>
              <!-- 隐私协议 -->
             <el-dialog
                class="down-qrcode-wrap"
                :visible.sync="showPrivacyDialog"
                width="750px"
                center>
                <iframe style="height:500px" src="http://service.inswindows.com/html/loginread/privacy"></iframe>
            </el-dialog>
            <!-- 服务协议 -->
            <el-dialog
                class="down-qrcode-wrap"
                :visible.sync="showServiceDialog"
                width="750px"
                center>
                <iframe style="height:500px" src="http://service.inswindows.com/html/loginread/service"></iframe>
            </el-dialog>
        
    </div>
</template>

<script>
import sendMsgCode from "../common/sendMsgCode";
import citySelect from "../common/citySelect";
import entry from "./Entry";
    export default {
        components:{
            sendMsgCode,
            citySelect,
            entry
        },
        data(){
            var validatePass = (rule, value, callback) => {
                    if (value === '') {
                      callback(new Error('请再次输入密码'));
                    } else if (value !== this.formRegist.pass) {
                       callback(new Error('两次输入密码不一致!'));
                    } else {
                      callback();
                    }
                };
                var validateCheck= (rule, value, callback) => {
                    if (!value) {
                      callback(new Error('请先阅读并同意相关协议'));
                    } else {
                      callback();
                    }
                };
            return {
                 entryHomeStatus:false,
                 entryData:{},
                 downAppDialogVisible:false,
                 active: 1,
                 labelPosition:"right",
                 agreementDialogVisible:false,
                 showServiceDialog:false,
                 showPrivacyDialog:false,
                 sendMsgData:{
                  phone:"",
                  usage:5
                 },
                 captchaCode:"",
                 captchaCodeKey:"",
                 formFirst:{
                     tel:"",
                     picCode:"",
                     msgCode:"",
                 },
                 registUid:"",
                 formRegist:{
                     tel:"",
                     msgCode:"",
                     pass:"",
                     repass:"",
                     checked:false
                 },
                 formRegistRule:{
                     tel:[
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                      ],
                      msgCode:[
                        { required: true, message: '请输入短信验证码', trigger: 'blur' }
                      ],
                     pass:[
                        { required: true, message: '请输入登录密码', trigger: 'blur' }
                      ],
                     repass:[
                        {required: true, validator: validatePass, trigger: 'blur' }
                      ],
                      checked:[
                        {required: true, validator: validateCheck, trigger: 'change' }
                      ]
                 },
                 formFirstRule:{
                     tel:[
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                      ],
                     picCode:[
                        { required: true, message: '请输入图片验证码', trigger: 'blur' }
                      ],
                     msgCode:[
                        { required: true, message: '请输入短信验证码', trigger: 'blur' }
                      ]
                 },
                //  第二步数据
                notInsuranceCompany:true,
                comTypeLoading:false,
                comInsurLoading:false,
                comTypeOptions:[],
                comInsurOptions:[],
                comNumsOptions:[{
                    name:"10人以下",
                    value:1
                    },{
                    name:"10-30",
                    value:2
                    },{
                    name:"31-50",
                    value:3
                    },{
                    name:"51-100",
                    value:4
                    },{
                    name:"101-200",
                    value:5
                    },{
                    name:"201-500",
                    value:6
                    },{
                    name:"501-1000",
                    value:7
                    },{
                    name:"1000人以上",
                    value:8}],
                    formSecond:{
                        comName:"",
                        comType:"",
                        insurance:"",
                        insuranceId:"",
                        location:{
                            prov:"",
                            city:"",
                            region:""
                        },
                        comNums:"",
                        adminName:"",
                        password:"",
                        email:"",
                        agree:false,
                    },
                    formSecondRule:{
                        comName: [
                          { required: true, message: '请输入企业（团队）名称', trigger: 'blur' }
                        ],
                        comType: [
                            { required: true, message: '请选择企业类型', trigger: 'change' }
                        ],
                        insurance: [
                            { required: false, message: '请选择保险公司', trigger: 'change' }
                        ],
                        adminName: [
                            { required: true, message: '请输入管理员姓名', trigger: 'blur' }
                        ],
                        password: [
                            { required: true, message: '数字字母组合，长度不低于8位', trigger: 'blur' }
                        ]
                    }
            }
        },
        methods: {
            // 
            handlePhoneChange(val){
               this.sendMsgData.phone=val;
            },
            // 第一步刷新图片验证码
            refreshCaptchaCode(){
                this.$axios.post('/api/common/file/captcha',)
                    .then((res)=> {
                    const _data=res.data;
                        if(_data.code==0){
                            this.captchaCode=_data.data.captcha;
                            this.captchaCodeKey=_data.data.key;
                        }else{
                          this.$message.error('抱歉，获取验证码图片失败，请稍候重试~');
                        }
                    })
            },
            // 注册用户
            handleRegist(formName){
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            //this.$message('努力提交中~');
                            this.$axios.post('/api/user/account/register',{
                                phone:this.formRegist.tel,
                                password:this.formRegist.pass,
                                captcha:this.formRegist.msgCode
                            })
                            .then((res)=> {
                                const _data=res.data;
                                    if(_data.code==0){
                                        this.$message({
                                            message: '注册成功，请进行下一步操作！',
                                            type: 'success'
                                        });
                                        this.downAppDialogVisible=false;
                                        this.registUid=_data.data.u_id;
                                        this.active = 2;
                                    }else{
                                       this.$message.error(_data.message);
                                    }
                                })

                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
            },
            // 第一步提交
            handleSubmitFirst(formName){

                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            //this.$message('努力提交中~');
                            this.$axios.post('/api/user/account/loginByComReg',{
                                phone:this.formFirst.tel,
                                imageCaptcha:this.formFirst.picCode,
                                imageCaptchaKey:this.captchaCodeKey,
                                smscode:this.formFirst.msgCode
                            })
                            .then((res)=> {
                                const _data=res.data;
                                // console.log(_data);
                                    if(_data.code==0){
                                        this.$message({
                                            message: '操作成功！',
                                            type: 'success'
                                        });
                                        this.registUid=_data.data.u_id,
                                        this.active = 2;
                                    }else{
                                       this.$message.error(_data.message);
                                    }
                                })

                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
            },
            // 第二步监听公司类型变化
            comTypeChange(val){
               if(val==1){//公司类型是保险公司
                    this.notInsuranceCompany=false;
                    let rule={ required: true, message: '请选择保险公司', trigger: 'change' };
                    this.formSecondRule.insurance.splice(0,1,rule)
                }else{
                    let rule={ required: false, message: '请选择保险公司', trigger: 'change' };
                    this.notInsuranceCompany=true;
                    this.formSecond.insurance="";
                    this.formSecond.insuranceId="";
                    this.formSecondRule.insurance.splice(0,1,rule)
                }
            },
            // 第二步提交
            handleSubmitSecond(formName){
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if(!this.formSecond.agree){
                                this.$message({
                                    message: '请阅读并同意保世界平台服务协议',
                                    type: 'warning'
                                });
                                return false;
                            }
                            //this.$message('努力提交中~');
                            this.$axios.post('/api/company/company/createCompany',{
                             u_id:this.registUid,
                             phone:this.formFirst.tel,
                             companyType:this.formSecond.comType,
                             belongInsuranceCompany:this.formSecond.insuranceId,
                             adminEmail:this.formSecond.email,
                             companyName:this.formSecond.comName,
                             adminName:this.formSecond.adminName,
                             adminPassword:this.formSecond.password,
                             employeeSize:this.formSecond.comNums,
                             province:this.formSecond.location.prov,
                             city:this.formSecond.location.city,
                             area:this.formSecond.location.region,
                            } )
                            .then((res)=> {
                                const _data=res.data;
                                    if(_data.code==0){
                                        this.active = 3
                                         this.$message({
                                            message: '恭喜您注册成功！',
                                            type: 'success'
                                        });
                                        this.$axios.post("/api/user/account/registerCompanyLogin",{
                                            u_id:this.registUid,
                                            choosenCid:_data.data.c_id,
                                            password:this.formSecond.password
                                        }).then((res)=>{
                                          const _data=res.data;
                                          if(_data.code==0){
                                             setTimeout(()=>{
                                                this.entryHomeStatus=true;
                                                this.entryData={
                                                    ..._data.data,
                                                    u_id:this.registUid,                                     m_name:_data.data.u_nickname||_data.data.u_realname,
                                                    tel:this.formFirst.tel.replace(/\s+/g,"")
                                                };
                                               },1000)
                                          }else{
                                             this.autoLoginFail()
                                          }      
                                        }).catch((err)=>{
                                            this.autoLoginFail()
                                        })
                                    }else{
                                        this.$message.error(_data.message);
                                    }
                                })
                            
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
            },
            // 最后一步提交
            handleSubmitThird(){
                 this.$router.push('/login');
            },
            // 自动登录失败
            autoLoginFail(){
                    this.$message("自动登录失败，请手动登录");
                    setTimeout(()=>{
                        this.handleSubmitThird()
                    },1000)
            },
            // 第二步，企业类型选择下拉菜单
            comTypeOptionShow(val){
              if(val && this.comTypeOptions.length==0){
                  this.comTypeLoading=true;
                  this.$axios.post('/api/company/company/getCompanyType', )
                    .then((res)=> {
                    this.comTypeLoading=false;
                    const _data=res.data;
                        if(_data.code==0){
                            this.comTypeOptions=_data.data;
                        }
                    }).catch((err)=>{
                        console.log(err);
                         this.comTypeLoading=false;
                    });
              }
            },
            // 第二步保险公司下拉列表
            comInsurOptionShow(val){
              if(val && this.comInsurOptions.length==0){
                  this.comInsurLoading=true;
                  this.$axios.post('/api/company/company/getInsuranceCompany' )
                    .then((res)=> {
                    this.comInsurLoading=false;
                    const _data=res.data;
                        if(_data.code==0){
                            this.comInsurOptions=_data.data;
                        }
                    }).catch((err)=>{
                        console.log(err);
                         this.comInsurLoading=false;
                    });
              }
            },
            // 第二步监听保险公司列表选择变化
            comInsurChange(val){
               this.formSecond.insuranceId=val
            },
        },
        created(){
             __vBus.$on("C_showQRcodeDialog",()=>{
                 this.formRegist.tel=this.formFirst.tel;
                 this.downAppDialogVisible=true;
             })
            this.refreshCaptchaCode();
            sessionStorage.clear();
        }
    }
</script>

<style lang="scss">
    .regist-wrap{
         width: 100%;
            height: 100%;
            // min-height: 800px;
            // min-height: 800px;
            overflow-y: scroll;
            background-color: #f3f3f3;
            // background-color: red;
            border-top:60px solid #f3f3f3;
            .regist-rules-body{
                height:400px;
                overflow-y:scroll;
                padding:0 10px;
              strong{
                  font-weight: bold;
              }
            }
        .regist-topbar{
            position: fixed;
            height: 60px;
            background-color: #545c64;
            top:0;
            right: 0;
            width: 100%;
            color: #fff;
            font-size:16px;
            h4{
                float: left;
                width: 240px;
                height: 50px;
                line-height: 50px;
                margin-top: 5px;
                border-right: 1px solid #454b55;
                font-size: 16px;
                text-align: center;
            }
        }
        .regist-form-wrap{
           
        //    position: absolute;
           background-color: #fff;
           width: 1200px;
           margin:20px auto;
            // top:50%;
            // left:50%;
            // transform:translate(-50%,-50%);
            overflow: auto;

        //    height: 628px;
           h5{
               line-height: 106px;
               height: 106px;
               margin-top:18px;
               text-align: center;
               color: #545c64;
               font-size: 18px;
           }

        }
        .step-wrap{
            width:760px;
            margin:0 auto; 
        }
        .next-btn{
        //    width: 100px;
           margin:0 auto;
           display: block;
        }
        .first-step-wrap{
          width: 530px;
          margin:72px auto;
          input{
              border-radius: 4px;
          }
          .code-input{
            width: 270px;
            position: relative;
          }
          .pic-code,.msg-code-btn{
            width:138px; 
            height: 40px;
            position: absolute;
            right: 0;
            top:0;
            
          }
          .pic-code{
            //  background-color: red;
             padding-top: 2px;
          }
        }
        .second-step-wrap{
            width: 570px;
            margin:72px auto;
            padding-right: 50px;
            .agreement{
                float: left;
                color: #409EFF;
                cursor: pointer;
            }
        }
        .third-step-wrap{
            margin:72px auto;
            .success{
                background-image: url('../../../static/img/home-icons.png');
                background-repeat: no-repeat;
                background-position-x: 44px;
                background-position-y: -1196px;
                width: 150px;
                height: 114px;
                margin: 0 auto;
                margin-top:126px;
                margin-bottom:112px;
                position: relative;
                span{
                    position: absolute;
                    bottom:0;
                    left: 0;
                    width: 100%;
                    display: block;
                    color: #353535;
                    font-size: 18px;
                    text-align: center;
                }
            }
        }
        .city-item{
            width: 122px;
            float: left;
            margin-right: 10px;

        }
        .city-item:last-child{
            margin-right: 0
        }
        .down-qrcode-wrap{
        img{
          display: block;
          width: 200px;
          margin:20px auto 5px auto; 
        }
        // span,em{
        //     text-align: center;
        //     display: block;
        // }
        em{
            font-size: 12px;
        }
        }
    .regist-checked{
        position: relative;
        // margin-left: -10px;
        .clause-wrap{
            position: absolute;
            top:0px;
            left:70px;
            cursor: pointer;
            i{
                color:#409EFF
            }
        }
        // .el-checkbox__label{
        //     display: flex;
        //     position: absolute;
        //     top:-2px;
        //     left:10px;
        // }
    }
    }
</style>