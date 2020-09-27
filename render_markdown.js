function decoration(t) {
    let em_and_strong = false;
    let now_strong = false;
    let now_em = false;
    let now_code = false;
    let now_s = false
    for (let i = 0; t.match(/\*{3}/) != null; i++) {
        if (em_and_strong) {
            t = t.replace("***", "</em></strong>");
            em_and_strong = false;
        } else {
            t = t.replace("***", "<em><strong>");
            em_and_strong = true;
        };
    };
    for (let i = 0; t.match(/\*{2}/) != null; i++) {
        if (now_strong) {
            t = t.replace("**", "</strong>");
            now_strong = false;
        } else {
            t = t.replace("**", "<strong>");
            now_strong = true;
        };
    };
    for (let i = 0; t.match(/\*{1}/) != null; i++) {
        if (now_em) {
            t = t.replace("*", "</em>");
            now_em = false;
        } else {
            t = t.replace("*", "<em>");
            now_em = true;
        };
    };
    for (let i = 0; t.match(/\`{1}/) != null; i++) {
        if (now_code) {
            t = t.replace("`", "</code>");
            now_code = false;
        } else {
            t = t.replace("`", "<code>");
            now_code = true;
        };
    };
    for (let i = 0; t.match(/\~{2}/) != null; i++) {
        if (now_s) {
            t = t.replace("~~", "</s>");
            now_s = false;
        } else {
            t = t.replace("~~", "<s>");
            now_s = true;
        };
    };
    for (let i = 0; t.match(/:red:/) != null; i++) {
        if (now_s) {
            t = t.replace(":red:", "</span>");
            now_s = false;
        } else {
            t = t.replace(":red:", "<span class='red'>");
            now_s = true;
        };
    };
    return t
};

function markdown(t) {
    let cs = t.split("\n");
    let rs = ""
    let now_code = false;
    for (let i = 0; i < cs.length; i++) {
        let e = cs[i];
        if (now_code != true) {
            switch (true) {
                case /^#\s/.test(e):
                    e = e.replace("# ", "<h1>") + "</h1>";
                    rs += e;
                    break
                case /^#{2}\s/.test(e):
                    e = e.replace("## ", "<h2>") + "</h2>";
                    rs += e;
                    break
                case /^#{3}\s/.test(e):
                    e = e.replace("### ", "<h3>") + "</h3>";
                    rs += e;
                    break
                case /^#{4}\s/.test(e):
                    e = e.replace("#### ", "<h4>") + "</h4>";
                    rs += e;
                    break
                case /^#{5}\s/.test(e):
                    e = e.replace("##### ", "<h5>") + "</h5>";
                    rs += e;
                    break
                case /^#{6}\s/.test(e):
                    e = e.replace("###### ", "<h6>") + "</h6>";
                    rs += e;
                    break
                case /^-{5}/.test(e):
                    e = "<hr>";
                    rs += e;
                    break
                case /^\`{3}/.test(e):
                    if (e.startsWith("``` ")) {
                        let lang = e.split(" ")[1];
                        e = `<pre><code class="${lang}">`;
                    } else {
                        e = "<pre><code>";
                    };
                    now_code = true;
                    rs += e;
                    break
                case /^:::message/.test(e):
                    e = "<div class='md-message'>";
                    rs += e;
                    break
                case /^:::comment/.test(e):
                    break
                case /^:::/.test(e):
                    e = "</div>"
                    rs += e;
                    break
                case /^@img\s/.test(e):
                    let es = e.split(" ");
                    let img_ele = `<img src="${es[1]}" loading="lazy" alt="${es[2]}">`;
                    rs += img_ele;
                    break
                case /^@youtube\s/.test(e):
                    let yt_es = e.split(" ");
                    let yt_ele = `<iframe loading="lazy" width="100%" height="56.85%" src="https://www.youtube.com/embed/${yt_es[1]}" frameborder="0" allowfullscreen></iframe>`
                    rs += yt_ele;
                    break
                default:
                    rs += decoration(e) + "<br>";
            };
        } else if (now_code == true && e.startsWith("```")) {
            now_code = false;
            rs += "</code></pre>"
        } else {
            rs += e + "<br>";
        };
    };
    console.log(rs)
    return rs
};