const gameData = {
    title: "論理回路パズル「AND・OR・NOTの迷宮」",
    password: "AND回路のせいで友達と一緒にボタンを押さないと開かない体育館の扉",

    // ===== STAGE 1: 基本ゲート =====
    stage1: {
        title: "STAGE 1: 基本ゲートの試練",
        instruction: "AND、OR、NOTの真理値表を埋めて扉を開け！制限時間は20秒だ！",
        timePerQ: 20,
        questions: [
            { gateType: "AND", question: "【論理積 (AND)】 入力Aが「1」、入力Bが「1」のとき、出力はどうなる？", answer: "1", options: ["0", "1", "2", "-1"], explanation: "AND（論理積）は両方「1」の時だけ「1」になる！2人同時にスイッチを押さないと開かない、友達がいないと一生進めない悲しき扉だ！", damage: "「一緒にボタンを押す友達がいない」という現実を自覚させられ、精神的ダメージ！" },
            { gateType: "OR", question: "【論理和 (OR)】 入力Aが「0」、入力Bが「1」のとき、出力はどうなる？", answer: "1", options: ["0", "1", "2", "-1"], explanation: "OR（論理和）はどちらか一方が「1」なら「1」になる！適当に片方押せば開くガバガバな扉だぜ！", damage: "適当に押したらハズレの扉が開いて、大量の黒板消しが落ちてきた！物理ダメージ！" },
            { gateType: "NOT", question: "【論理否定 (NOT)】 入力が「1」のとき、出力はどうなる？", answer: "0", options: ["0", "1", "2", "変わらない"], explanation: "NOT（論理否定）は入力をひっくり返す！「押すなよ！絶対に押すなよ！」と言われたら押してしまうダチョウ倶楽部回路だ！", damage: "ダチョウ倶楽部のノリで飛び込んだら完全にスベった！いたたまれない精神的ダメージ！" },
            { gateType: "AND", question: "【論理積 (AND)】 入力Aが「1」、入力Bが「0」のとき、出力はどうなる？", answer: "0", options: ["0", "1", "2", "-1"], explanation: "片方だけ「1」でもAND回路は開かない！裏切り者は容赦なく閉め出す冷酷な回路だぜ。", damage: "「お前はもう用済みだ」と扉に裏切り者扱いされ、心がへし折られた！" },
            { gateType: "OR", question: "【論理和 (OR)】 入力Aが「0」、入力Bが「0」のとき、出力はどうなる？", answer: "0", options: ["0", "1", "2", "バグる"], explanation: "OR回路でも両方「0」ならさすがに開かない！サボるやつには扉は開かれないんだニャ！", damage: "サボり癖を見透かされ、全校集会で説教された！メンタルに深い傷を負った！" }
        ]
    },

    // ===== STAGE 2: スイッチパズル =====
    stage2: {
        title: "STAGE 2: 複合回路の迷宮",
        instruction: "複数のゲートが組み合わさった回路だ。出力を予測してトラップを回避しろ！",
        timePerQ: 25,
        questions: [
            { gateType: "NOR", question: "「AとBをOR回路に通し、その結果をNOT回路に通す」。この回路（NOR回路）に、A=0, B=0 を入力した時の出力は？", answer: "1", options: ["0", "1", "2", "エラー"], explanation: "0と0のORは「0」。それをNOTでひっくり返すから「1」！誰も何もしない時だけ扉が開く、究極のニート回路だ！", damage: "「ニートの才能がない」と扉に判定され、就活の不安が押し寄せた！" },
            { gateType: "NAND", question: "「AとBをAND回路に通し、その結果をNOT回路に通す」。この回路（NAND回路）に、A=1, B=1 を入力した時の出力は？", answer: "0", options: ["0", "1", "2", "エラー"], explanation: "1と1のANDは「1」。それをNOTでひっくり返すから「0」！全員がやる気を出した瞬間に扉が閉まるひねくれ者回路だぜ！", damage: "やる気を出したら逆に怒られるという理不尽を味わい、モチベーションが死んだ！" },
            { gateType: "COMPLEX", question: "「A=1, B=0」のとき、『(A OR B) AND A』 の出力は？", answer: "1", options: ["0", "1", "Bになる", "エラー"], explanation: "1 OR 0 は「1」。その「1」と A(1) を AND するから結果は「1」！無駄に複雑な配線を作った業者の陰謀だ！", damage: "配線が複雑すぎて触った瞬間に感電した！ビリビリビリ！" },
            { gateType: "COMPLEX", question: "「A=0, B=1」のとき、『NOT(A) AND B』 の出力は？", answer: "1", options: ["0", "1", "2", "エラー"], explanation: "A(0)のNOTで「1」。それとB(1)をANDするから結果は「1」だ！脳内がこんがらがってきたか？", damage: "脳の処理能力を超えて知恵熱が出た！頭から煙が出ている！" },
            { gateType: "NAND", question: "NANDゲート（NOT AND）だけを組み合わせて、すべての論理回路（AND, OR, NOT）を作ることができる。〇か×か？", answer: "〇", options: ["〇", "×"], explanation: "正解は〇！NAND回路さえあれば世界は創れる！NANDは神のパーツとも呼ばれている（※呼んでない）。", damage: "「神のパーツ」の偽物を掴まされ、高額なローンの請求書が届いた！" }
        ]
    },

    // ===== STAGE 3: 排他的論理和（XOR） =====
    stage3: {
        title: "STAGE 3: XORの壁",
        instruction: "計算回路の要、「XOR（排他的論理和）」の性質を見抜け！",
        timePerQ: 20,
        questions: [
            { gateType: "XOR", question: "【XOR】 入力Aが「1」、入力Bが「0」のとき、出力はどうなる？", answer: "1", options: ["0", "1", "2", "-1"], explanation: "XORは「どちらか一方だけが1」のときに「1」になる！被るのが嫌いなワガママ回路だ！", damage: "ワガママな回路に振り回され、パシリにされて体力を削られた！" },
            { gateType: "XOR", question: "【XOR】 入力Aが「1」、入力Bが「1」のとき、出力はどうなる？", answer: "0", options: ["0", "1", "2", "-1"], explanation: "両方「1」だとXORは「0」になる！「ペアルックとかマジ無理」と扉が閉まるんだぜ。", damage: "「お前と服が被るとかマジ無理」と言われ、ショックで寝込んだ！" },
            { gateType: "XOR", question: "XOR回路を基本的なゲートで表現すると、「(A AND NOT(B)) 〇 (NOT(A) AND B)」。〇に入るのは？", answer: "OR", options: ["AND", "OR", "NOT", "XOR"], explanation: "「Aだけが1」または「Bだけが1」の時に開くから、〇には「OR」が入る！呪文みたいに長い式だ！", damage: "長すぎる呪文を噛んでしまい、回復魔法のつもりが自爆魔法になった！" },
            { gateType: "COMPLEX", question: "入力Aと入力Bが「まったく同じ値」の時だけ「1」を出力したい。XORの後ろに何を繋げばいい？", answer: "NOT", options: ["AND", "OR", "NOT", "NAND"], explanation: "XORは「違う値」の時に1を出すから、それを「NOT」で反転させれば「同じ値の時に1（XNOR回路）」になる！", damage: "反転の反転の反転…と考えすぎて三半規管が狂い、壁に激突した！" }
        ]
    },

    // ===== STAGE 4: 半加算回路 =====
    stage4: {
        title: "STAGE 4: 半加算回路の真実（BOSS）",
        instruction: "ついにコンピュータの心臓部へ！足し算を行う回路を解き明かせ！",
        timePerQ: 0, // 制限時間なし
        questions: [
            { gateType: "HALF-ADDER", question: "コンピュータが1桁の2進数の足し算（A＋B）を行うための回路を何という？", answer: "半加算回路", options: ["半加算回路", "全加算回路", "半減算回路", "全自動計算機"], explanation: "1桁だけの計算なので「半」加算回路と呼ばれる。下からの桁上がりを無視する大雑把なヤツだ！", damage: "大雑把な計算のせいで給食費の計算が合わず、自腹を切らされた！" },
            { gateType: "XOR", question: "半加算回路において、足し算の「和（S）」を計算するのに使われる論理回路はどれ？", answer: "XOR", options: ["AND", "OR", "NOT", "XOR"], explanation: "0+0=0, 0+1=1, 1+0=1, 1+1=0(桁上がり)。この「和」のパターンはXOR回路と完全に一致するんだ！奇跡！", damage: "奇跡を信じてガチャを回したら大爆死し、財布と心が空っぽになった！" },
            { gateType: "AND", question: "半加算回路において、「桁上がり（C）」を計算するのに使われる論理回路はどれ？", answer: "AND", options: ["AND", "OR", "NOT", "XOR"], explanation: "桁上がりが起きるのは「1+1」の時だけ。つまり両方が1の時に1になる「AND」回路そのものだ！", damage: "上から降ってきた巨大な「桁」に押し潰され、ペラペラになった！" },
            { gateType: "COMPLEX", question: "下位の桁からの桁上がりも含めて計算できる、より完全な加算回路を何という？", answer: "全加算回路", options: ["半加算回路", "全加算回路", "絶対加算回路", "超加算回路"], explanation: "「全加算回路」は、半加算回路2つとOR回路を組み合わせて作られる！これを何個も繋げば、スマホのCPUになるんだぜ！", damage: "フルパワーになったCPUの熱暴走に巻き込まれ、アフロヘアーになった！" }
        ]
    }
};
