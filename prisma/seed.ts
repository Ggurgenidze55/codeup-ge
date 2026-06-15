import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const adminPw = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@codeup.ge' },
    update: {},
    create: { name: 'ადმინისტრატორი', email: 'admin@codeup.ge', password: adminPw, role: 'ADMIN' },
  })

  // Demo user
  const userPw = await bcrypt.hash('demo123', 12)
  const demo = await prisma.user.upsert({
    where: { email: 'demo@codeup.ge' },
    update: {},
    create: { name: 'გიორგი ბერიძე', email: 'demo@codeup.ge', password: userPw, streak: 5 },
  })

  // HTML Course
  const htmlCourse = await prisma.course.upsert({
    where: { slug: 'html-css' },
    update: {},
    create: {
      title: 'HTML & CSS — ვებ-განვითარების საფუძვლები',
      slug: 'html-css',
      description: 'ისწავლე HTML სტრუქტურა, CSS სტილები, Flexbox, Grid და რეაგირებადი ვებ-დიზაინი ნულიდან. ეს კურსი განკუთვნილია სრული დამწყებებისთვის.',
      language: 'ge',
      level: 'BEGINNER',
      price: 0,
      icon: '🌐',
      color: '#E44D26',
      published: true,
    },
  })

  // Give demo user access
  await prisma.userCourse.upsert({
    where: { userId_courseId: { userId: demo.id, courseId: htmlCourse.id } },
    update: {},
    create: { userId: demo.id, courseId: htmlCourse.id, progress: 0 },
  })

  // ==================== CHAPTER 1: HTML საფუძვლები ====================
  const ch1 = await prisma.chapter.upsert({
    where: { courseId_slug: { courseId: htmlCourse.id, slug: 'html-safuzvlebi' } },
    update: {},
    create: { courseId: htmlCourse.id, title: 'HTML საფუძვლები', slug: 'html-safuzvlebi', order: 1 },
  })

  // Lesson 1.1
  const l11 = await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: ch1.id, slug: 'raa-html' } },
    update: {},
    create: {
      chapterId: ch1.id,
      title: 'რა არის HTML?',
      slug: 'raa-html',
      order: 1,
      duration: 8,
      explanation: 'HTML (HyperText Markup Language) არის ვებ-გვერდების ძირითადი სტრუქტურული ენა.',
      codeScript: [
        {
          code: '<!DOCTYPE html>',
          explanation: 'DOCTYPE — ეს სტრიქონი ბრაუზერს ეუბნება, რომ ეს HTML5 დოკუმენტია. ყოველი HTML ფაილი ამ სტრიქონით იწყება.'
        },
        {
          code: '<!DOCTYPE html>\n<html lang="ka">',
          explanation: 'html ტეგი — ეს არის HTML-ის ძირეული (root) ელემენტი. lang="ka" ნიშნავს, რომ გვერდი ქართულ ენაზეა.'
        },
        {
          code: '<!DOCTYPE html>\n<html lang="ka">\n  <head>',
          explanation: 'head სექცია — აქ ვათავსებთ ინფორმაციას გვერდის შესახებ, რომელიც მომხმარებელს პირდაპირ არ ჩანს: სათაური, სტილები, მეტა-ინფო.'
        },
        {
          code: '<!DOCTYPE html>\n<html lang="ka">\n  <head>\n    <meta charset="UTF-8">\n    <title>ჩემი პირველი გვერდი</title>\n  </head>',
          explanation: 'meta charset="UTF-8" — ქართული ასოების სწორად ჩვენებისთვის, title კი ბრაუზერის ჩანართში ჩანს.'
        },
        {
          code: '<!DOCTYPE html>\n<html lang="ka">\n  <head>\n    <meta charset="UTF-8">\n    <title>ჩემი პირველი გვერდი</title>\n  </head>\n  <body>\n    <h1>გამარჯობა, სამყარო!</h1>\n    <p>ეს არის ჩემი პირველი ვებ-გვერდი.</p>\n  </body>\n</html>',
          explanation: 'body სექცია — ეს არის ის, რაც ეკრანზე ჩანს. h1 — სათაური, p — პარაგრაფი. ახლა გვაქვს სრული HTML სტრუქტურა!'
        },
      ],
    },
  })

  // Exercise 1.1
  await prisma.exercise.upsert({
    where: { lessonId: l11.id },
    update: {},
    create: {
      lessonId: l11.id,
      task: 'შექმენი HTML გვერდი: დაამატე DOCTYPE, html, head (UTF-8 charset და "HTML სავარჯიშო" სათაური) და body სექციები. body-ში ჩაწერე h1 სათაური "გამარჯობა!" და p პარაგრაფი "ეს ჩემი პირველი HTML კოდია."',
      starterCode: '<!-- დაწერე HTML კოდი აქ -->',
      solution: '<!DOCTYPE html>\n<html lang="ka">\n  <head>\n    <meta charset="UTF-8">\n    <title>HTML სავარჯიშო</title>\n  </head>\n  <body>\n    <h1>გამარჯობა!</h1>\n    <p>ეს ჩემი პირველი HTML კოდია.</p>\n  </body>\n</html>',
      hints: [
        'პირველ სტრიქონში ჩაწერე <!DOCTYPE html>',
        'head-ში charset-ი განსაზღვრე: <meta charset="UTF-8">',
        'body-ში h1 ტეგი ასე გამოიყურება: <h1>ტექსტი</h1>',
      ],
      expectedOutput: 'გამარჯობა!',
    },
  })

  // Quiz 1.1
  const q11 = await prisma.quiz.create({
    data: {
      lessonId: l11.id,
      title: 'HTML საფუძვლები — ტესტი',
      timeLimit: 10,
    },
  })
  const quiz11Questions = [
    { text: 'HTML-ის სრული სახელია:', options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperTransfer Markup Language', 'Home Tool Markup Language'], correct: 0, exp: 'HTML — HyperText Markup Language. ეს არის ვებ-გვერდების სტრუქტურული ენა.' },
    { text: 'HTML ფაილი რომელი სტრიქონით იწყება?', options: ['<html>', '<!DOCTYPE html>', '<head>', '<body>'], correct: 1, exp: '<!DOCTYPE html> ეუბნება ბრაუზერს, რომ ეს HTML5 დოკუმენტია.' },
    { text: 'სად ვათავსებთ გვერდის სათაურს (tab-ში რომ ჩანს)?', options: ['<body>-ში', '<header>-ში', '<title>-ში', '<h1>-ში'], correct: 2, exp: '<title> ტეგი head-ში მდებარეობს და ბრაუზერის tab-ში ჩანს.' },
    { text: 'რომელი ტეგი განსაზღვრავს პარაგრაფს?', options: ['<par>', '<paragraph>', '<p>', '<text>'], correct: 2, exp: '<p> (paragraph) ტეგი HTML-ში პარაგრაფს აღნიშნავს.' },
    { text: 'lang="ka" ატრიბუტი HTML ტეგში რას ნიშნავს?', options: ['კოდი კარგია (ka = kargi)', 'გვერდის ენა ქართულია', 'კოდი ავტომატურია', 'ლინკი ქართული საიტებისაა'], correct: 1, exp: 'lang ატრიბუტი განსაზღვრავს გვერდის ენას. "ka" — ქართული ISO კოდია.' },
  ]
  for (let i = 0; i < quiz11Questions.length; i++) {
    const qq = quiz11Questions[i]
    await prisma.question.create({
      data: { quizId: q11.id, text: qq.text, options: qq.options, correctAnswer: qq.correct, explanation: qq.exp, order: i + 1 },
    })
  }

  // Lesson 1.2
  const l12 = await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: ch1.id, slug: 'html-tegebi' } },
    update: {},
    create: {
      chapterId: ch1.id,
      title: 'ძირითადი HTML ტეგები',
      slug: 'html-tegebi',
      order: 2,
      duration: 10,
      explanation: 'HTML-ში ბევრი სხვადასხვა ტეგია — სათაურები, ბმულები, სურათები, სიები.',
      codeScript: [
        {
          code: '<h1>მთავარი სათაური</h1>\n<h2>ქვე-სათაური</h2>\n<h3>მესამე დონის სათაური</h3>',
          explanation: 'სათაურები — HTML-ში 6 დონის სათაური გვაქვს: h1-დან h6-მდე. h1 ყველაზე მნიშვნელოვანია, h6 — ყველაზე პატარა.'
        },
        {
          code: '<p>ეს არის <strong>სქელი</strong> და <em>დახრილი</em> ტექსტი.</p>\n<p>ასევე შეგვიძლია <a href="https://google.com">ბმული</a> ჩავდოთ.</p>',
          explanation: 'strong — სქელი (bold) ტექსტი, em — დახრილი (italic). a href — ბმული სხვა გვერდზე.'
        },
        {
          code: '<img src="surathi.jpg" alt="სურათის აღწერა" width="300">\n<br>\n<hr>',
          explanation: 'img — სურათი (src=ფაილი, alt=ტექსტი თუ სურათი ვერ ჩაიტვირთა). br — ახალი სტრიქონი, hr — ჰორიზონტალური ხაზი.'
        },
        {
          code: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n\n<ol>\n  <li>პირველი</li>\n  <li>მეორე</li>\n</ol>',
          explanation: 'ul — დაუნომრავი სია (bullet points), ol — დანომრილი სია. li — სიის ელემენტი.'
        },
      ],
    },
  })

  await prisma.exercise.upsert({
    where: { lessonId: l12.id },
    update: {},
    create: {
      lessonId: l12.id,
      task: 'შექმენი HTML გვერდი სათაურით "პროგრამირების ენები", დაამატე p პარაგრაფი "ყველაზე პოპულარული ენები:" და ul სია სამი li ელემენტით: Python, JavaScript, Java.',
      starterCode: '<!DOCTYPE html>\n<html lang="ka">\n<head>\n  <meta charset="UTF-8">\n  <title>სია</title>\n</head>\n<body>\n  <!-- დაამატე კოდი -->\n</body>\n</html>',
      solution: '<!DOCTYPE html>\n<html lang="ka">\n<head>\n  <meta charset="UTF-8">\n  <title>სია</title>\n</head>\n<body>\n  <h1>პროგრამირების ენები</h1>\n  <p>ყველაზე პოპულარული ენები:</p>\n  <ul>\n    <li>Python</li>\n    <li>JavaScript</li>\n    <li>Java</li>\n  </ul>\n</body>\n</html>',
      hints: [
        'h1 ტეგი სათაურისთვის: <h1>სათაური</h1>',
        'ul სია იწყება <ul> ტეგით, თითოეული ელემენტი კი <li>-თი',
        'ul-ს შიგნით სამი li ელემენტი უნდა გქონდეს',
      ],
    },
  })

  const q12 = await prisma.quiz.create({ data: { lessonId: l12.id, title: 'HTML ტეგები — ტესტი', timeLimit: 10 } })
  const quiz12Qs = [
    { text: 'რომელი ტეგია ყველაზე მნიშვნელოვანი სათაური?', options: ['<h6>', '<h1>', '<header>', '<title>'], correct: 1, exp: 'h1 ყველაზე მნიშვნელოვანი და დიდი სათაურია. h6 ყველაზე პატარა.' },
    { text: 'ბმულის (ლინკის) ტეგი HTML-ში:', options: ['<link>', '<url>', '<a>', '<href>'], correct: 2, exp: '<a href="..."> ტეგი ბმულს ქმნის. href ატრიბუტი მისამართს განსაზღვრავს.' },
    { text: 'სურათის ჩასმის სწორი ტეგი:', options: ['<image src="f.jpg">', '<img src="f.jpg">', '<picture src="f.jpg">', '<photo href="f.jpg">'], correct: 1, exp: '<img src="ფაილი" alt="ტექსტი"> — HTML-ში სურათის სტანდარტული ტეგი.' },
    { text: 'დაუნომრავი სია HTML-ში:', options: ['<list>', '<ol>', '<ul>', '<dl>'], correct: 2, exp: 'ul (unordered list) — bullet-point სია. ol (ordered list) — დანომრილი სია.' },
    { text: 'strong ტეგი ტექსტს როგორ ჩვენებს?', options: ['დახრილი', 'ხაზგასმული', 'სქელი (bold)', 'გადახაზული'], correct: 2, exp: '<strong> ტეგი ტექსტს სქელი შრიფტით (bold) აჩვენებს.' },
  ]
  for (let i = 0; i < quiz12Qs.length; i++) {
    const qq = quiz12Qs[i]
    await prisma.question.create({ data: { quizId: q12.id, text: qq.text, options: qq.options, correctAnswer: qq.correct, explanation: qq.exp, order: i + 1 } })
  }

  // Lesson 1.3
  const l13 = await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: ch1.id, slug: 'html-formebi' } },
    update: {},
    create: {
      chapterId: ch1.id,
      title: 'HTML ფორმები',
      slug: 'html-formebi',
      order: 3,
      duration: 12,
      explanation: 'ფორმები საშუალებას გვაძლევს მომხმარებლისგან ინფორმაცია მივიღოთ — ელ-ფოსტა, პაროლი, ტექსტი.',
      codeScript: [
        {
          code: '<form action="/submit" method="POST">',
          explanation: 'form ტეგი — ფორმის კონტეინერი. action — სად გაიგზავნება მონაცემები, method — POST ან GET.'
        },
        {
          code: '<form action="/submit" method="POST">\n  <label for="saxeli">სახელი:</label>\n  <input type="text" id="saxeli" name="saxeli" placeholder="შენი სახელი">',
          explanation: 'label — ველის დასახელება. input type="text" — ტექსტური ველი. placeholder — მაგალითი ტექსტი, id და for უნდა ემთხვეოდეს.'
        },
        {
          code: '<form action="/submit" method="POST">\n  <label for="saxeli">სახელი:</label>\n  <input type="text" id="saxeli" name="saxeli">\n  \n  <label for="email">ელ-ფოსტა:</label>\n  <input type="email" id="email" name="email" required>',
          explanation: 'type="email" — ელ-ფოსტის ველი, ბრაუზერი ავტომატურად ამოწმებს ფორმატს. required — სავალდებულო ველი.'
        },
        {
          code: '<form action="/submit" method="POST">\n  <label for="saxeli">სახელი:</label>\n  <input type="text" id="saxeli" name="saxeli" required>\n  \n  <label for="email">ელ-ფოსტა:</label>\n  <input type="email" id="email" name="email" required>\n  \n  <label for="sheetyvana">შეტყობინება:</label>\n  <textarea id="sheetyvana" name="sheetyvana" rows="4"></textarea>\n  \n  <button type="submit">გაგზავნა</button>\n</form>',
          explanation: 'textarea — მრავალსტრიქოიანი ტექსტის ველი. button type="submit" — ფორმის გაგზავნის ღილაკი. ახლა გვაქვს სრული ფორმა!'
        },
      ],
    },
  })

  await prisma.exercise.upsert({
    where: { lessonId: l13.id },
    update: {},
    create: {
      lessonId: l13.id,
      task: 'შექმენი შესვლის ფორმა: form ტეგი method="POST", label და input type="email" (id="email", required), label და input type="password" (id="password", required), button "შესვლა".',
      starterCode: '<!DOCTYPE html>\n<html lang="ka">\n<head><meta charset="UTF-8"><title>ფორმა</title></head>\n<body>\n  <h2>შესვლა</h2>\n  <!-- ფორმა აქ -->\n</body>\n</html>',
      solution: '<!DOCTYPE html>\n<html lang="ka">\n<head><meta charset="UTF-8"><title>ფორმა</title></head>\n<body>\n  <h2>შესვლა</h2>\n  <form method="POST">\n    <label for="email">ელ-ფოსტა:</label>\n    <input type="email" id="email" name="email" required>\n    <label for="password">პაროლი:</label>\n    <input type="password" id="password" name="password" required>\n    <button type="submit">შესვლა</button>\n  </form>\n</body>\n</html>',
      hints: [
        'form ტეგი: <form method="POST">...</form>',
        'label for="email" და input id="email" უნდა ემთხვეოდეს',
        'პაროლისთვის input type="password" გამოიყენე',
      ],
    },
  })

  const q13 = await prisma.quiz.create({ data: { lessonId: l13.id, title: 'HTML ფორმები — ტესტი', timeLimit: 10 } })
  const quiz13Qs = [
    { text: 'ელ-ფოსტის ველის input type:', options: ['type="mail"', 'type="email"', 'type="text"', 'type="address"'], correct: 1, exp: 'type="email" ელ-ფოსტის ველია, ბრაუზერი @ სიმბოლოს ავტომატურად ამოწმებს.' },
    { text: 'required ატრიბუტი რას ნიშნავს?', options: ['ველი მხოლოდ წასაკითხია', 'ველი სავალდებულოა შევსებისთვის', 'ველი ნაგულისხმევი მნიშვნელობით', 'ველი გამორთულია'], correct: 1, exp: 'required — ველი სავალდებულოა. ფორმა ვერ გაიგზავნება ამ ველის შევსების გარეშე.' },
    { text: 'textarea-ს განსხვავება input-ისგან:', options: ['textarea ამ შემთხვევაში პაროლია', 'textarea მრავალსტრიქოიანი ველია', 'textarea მხოლოდ ციფრებისთვისაა', 'textarea სურათის ატვირთვისთვისაა'], correct: 1, exp: 'textarea — მრავალსტრიქოიანი ტექსტური ველი. input — ერთსტრიქოიანი.' },
    { text: 'label for და input id ატრიბუტებმა:', options: ['შეიძლება განსხვავებული იყოს', 'უნდა ემთხვეოდეს ერთმანეთს', 'label-ს for ატრიბუტი არ სჭირდება', 'id ყოველთვის "input1" უნდა იყოს'], correct: 1, exp: 'label-ის for ატრიბუტი input-ის id-ს უნდა ემთხვეოდეს — ეს accessibility-სთვისაა.' },
    { text: 'ფორმის გაგზავნის ღილაკი:', options: ['<button>გაგზავნა</button>', '<input type="submit">', '<button type="submit">გაგზავნა</button>', 'ბ და გ ორივე სწორია'], correct: 3, exp: 'ორივე სწორია: <input type="submit"> და <button type="submit">.</button>' },
  ]
  for (let i = 0; i < quiz13Qs.length; i++) {
    const qq = quiz13Qs[i]
    await prisma.question.create({ data: { quizId: q13.id, text: qq.text, options: qq.options, correctAnswer: qq.correct, explanation: qq.exp, order: i + 1 } })
  }

  // Chapter 1 Exam
  const exam1 = await prisma.exam.create({
    data: {
      chapterId: ch1.id,
      title: 'HTML საფუძვლები — თავის გამოცდა',
      timeLimit: 20,
      passMark: 70,
    },
  })
  const exam1Qs = [
    { t: 'HTML-ის სრული სახელია:', opts: ['HyperText Markup Language', 'High Text Modern Language', 'Home Tool Markup Language', 'HyperTransfer Method Language'], c: 0, e: 'HTML — HyperText Markup Language.' },
    { t: '<!DOCTYPE html> სად ვათავსებთ?', opts: ['ფაილის ბოლოში', 'body-ში', 'ფაილის დასაწყისში', 'head-ში'], c: 2, e: 'DOCTYPE ყოველთვის ფაილის პირველ სტრიქონში უნდა იყოს.' },
    { t: 'head სექციაში ვათავსებთ:', opts: ['გვერდის ტექსტს', 'სურათებს', 'მეტა-ინფორმაციასა და სათაურს', 'ფორმებს'], c: 2, e: 'head-ში: title, meta, link (CSS), script.' },
    { t: 'body სექციაში ვათავსებთ:', opts: ['CSS სტილებს', 'ხილულ კონტენტს', 'HTML ვერსიას', 'meta ტეგებს'], c: 1, e: 'body — ეს ის ნაწილია, რომელიც ეკრანზე ჩანს.' },
    { t: 'ქართული ასოების სწორი ჩვენებისთვის:', opts: ['charset="GEO"', 'charset="GEORGIAN"', 'charset="UTF-8"', 'charset="KA"'], c: 2, e: 'UTF-8 Unicode-ის სტანდარტია, ყველა ენის სიმბოლოს მხარს უჭერს.' },
    { t: 'h1 - h6 ტეგები განსაზღვრავს:', opts: ['ჰიპერბმულებს', 'სათაურებს', 'სიებს', 'ცხრილებს'], c: 1, e: 'h1-h6 — სათაურების ტეგები. h1 ყველაზე მნიშვნელოვანი.' },
    { t: 'a href="/about" რა ქმნის?', opts: ['სურათს', 'ბმულს /about გვერდზე', 'ფორმის ველს', 'სიის ელემენტს'], c: 1, e: 'a href ტეგი ბმულს ქმნის. href ატრიბუტი მისამართს განსაზღვრავს.' },
    { t: 'ul-ს შიგნით რა ტეგი გამოვიყენოთ?', opts: ['<item>', '<element>', '<li>', '<list-item>'], c: 2, e: '<li> (list item) — სიის ელემენტი, ul-ის ან ol-ის შიგნით.' },
    { t: 'input type="password" ველი:', opts: ['ციფრებს ჩვენებს', 'ტექსტს ვარსკვლავებით ფარავს', 'ელ-ფოსტას ამოწმებს', 'სავალდებულო ველია'], c: 1, e: 'password ველი ნაბეჭდ ტექსტს ● სიმბოლოებით ფარავს.' },
    { t: 'img ტეგის alt ატრიბუტი:', opts: ['სურათის ზომაა', 'სურათის ალტერნატიული ტექსტი', 'სურათის URL', 'სურათის სტილი'], c: 1, e: 'alt — სურათის ალტ-ტექსტი. გამოჩნდება, თუ სურათი ვერ ჩაიტვირთა, და screen reader-ებისთვის.' },
    { t: 'HTML ფაილის გაფართოება:', opts: ['.html ან .htm', '.hml', '.web', '.page'], c: 0, e: 'HTML ფაილებს .html ან .htm გაფართოება აქვს.' },
    { t: 'form method="POST" vs method="GET":', opts: ['POST URL-ში ჩანს, GET — არა', 'GET URL-ში ჩანს, POST — არა', 'ორივე ერთნაირია', 'POST მხოლოდ ფოტოებისთვის'], c: 1, e: 'GET — მონაცემები URL-ში ჩანს. POST — სხეულში ამალ, URL-ში არ ჩანს.' },
    { t: '<br> ტეგი HTML-ში:', opts: ['ბმულის ტეგი', 'ახალი სტრიქონი', 'სქელი ტექსტი', 'ბლოკი'], c: 1, e: '<br> — line break, ახალ სტრიქონზე გადასვლა.' },
    { t: 'HTML-ში კომენტარი:', opts: ['// კომენტარი', '/* კომენტარი */', '<!-- კომენტარი -->', '# კომენტარი'], c: 2, e: 'HTML კომენტარი: <!-- ასე გამოიყურება -->. ბრაუზერი კომენტარს არ ჩვენებს.' },
    { t: '<em> ტეგი ტექსტს:', opts: ['სქელი შრიფტით ჩვენებს', 'დახრილი შრიფტით ჩვენებს', 'ხაზს უსვამს', 'ფერს უცვლის'], c: 1, e: '<em> (emphasis) — დახრილი (italic) ტექსტი. <strong> — სქელი.' },
    { t: 'table ტეგი HTML-ში:', opts: ['ბმულს ქმნის', 'სურათს ჩვენებს', 'ცხრილს ქმნის', 'ფორმას ქმნის'], c: 2, e: '<table>, <tr> (row), <th> (header), <td> (data) — ცხრილის სტრუქტურა.' },
    { t: 'div ტეგი HTML-ში:', opts: ['ტექსტური ფორმატირება', 'ბლოკ-კონტეინერი', 'ინლაინ-ელემენტი', 'სიის ტეგი'], c: 1, e: '<div> — ბლოკ-კონტეინერი, გამოიყენება ელემენტების დაჯგუფებისა და სტილის გამოყენებისთვის.' },
    { t: 'span ტეგი HTML-ში:', opts: ['ბლოკ-ელემენტი', 'ინლაინ-ელემენტი', 'ფორმის ველი', 'სათაური'], c: 1, e: '<span> — ინლაინ-ელემენტი, ტექსტის ნაწილის სტილისთვის.' },
    { t: 'header სემანტიკური ტეგი:', opts: ['ყოველთვის head-ს ნიშნავს', 'გვერდის ან სექციის სათაური ნაწილი', 'footer-ის ბოლო', 'ნავიგაციის ტეგი'], c: 1, e: '<header> სემანტიკური ტეგია — გვერდის ან section-ის სათაური ნაწილი.' },
    { t: 'meta viewport ტეგი:', opts: ['SEO-სთვის', 'მობილური მოწყობილობებისთვის', 'ენის განსაზღვრისთვის', 'სტილებისთვის'], c: 1, e: '<meta name="viewport"> — გვერდის სწორი ჩვენება მობილურ მოწყობილობებზე.' },
  ]
  for (let i = 0; i < exam1Qs.length; i++) {
    const q = exam1Qs[i]
    await prisma.question.create({ data: { examId: exam1.id, text: q.t, options: q.opts, correctAnswer: q.c, explanation: q.e, order: i + 1 } })
  }

  // ==================== CHAPTER 2: CSS ====================
  const ch2 = await prisma.chapter.upsert({
    where: { courseId_slug: { courseId: htmlCourse.id, slug: 'css-stilizacia' } },
    update: {},
    create: { courseId: htmlCourse.id, title: 'CSS სტილიზაცია', slug: 'css-stilizacia', order: 2 },
  })

  // Lesson 2.1
  const l21 = await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: ch2.id, slug: 'css-shesavali' } },
    update: {},
    create: {
      chapterId: ch2.id,
      title: 'CSS შესავალი',
      slug: 'css-shesavali',
      order: 1,
      duration: 10,
      explanation: 'CSS (Cascading Style Sheets) განსაზღვრავს ვებ-გვერდის გარეგნობას.',
      codeScript: [
        { code: '/* CSS სტრუქტურა */\nselector {\n  property: value;\n}', explanation: 'CSS-ის ძირითადი სტრუქტურა: selector — ვინ სტილდება, property — რა თვისება, value — მნიშვნელობა.' },
        { code: 'h1 {\n  color: #6C63FF;\n  font-size: 2rem;\n  font-weight: bold;\n}', explanation: 'h1 ყველა სათაურს ვარდასფერ ფერში ვხატავთ, 2rem ზომის შრიფტით, სქელი. color HEX კოდია (#RRGGBB).' },
        { code: 'h1 {\n  color: #6C63FF;\n  font-size: 2rem;\n}\n\n.card {\n  background-color: #1a1a2e;\n  padding: 20px;\n  border-radius: 10px;\n  border: 1px solid #2a2a3c;\n}', explanation: '.card — კლასის სელექტორი (. დასაწყისში). background-color, padding (შიდა padding), border-radius — მოხრილი კიდეები.' },
        { code: 'h1 {\n  color: #6C63FF;\n}\n\n.card {\n  padding: 20px;\n  border-radius: 10px;\n}\n\n#main-title {\n  text-align: center;\n  margin-bottom: 30px;\n}\n\np {\n  line-height: 1.6;\n  color: #888;\n}', explanation: '#main-title — ID სელექტორი (# დასაწყისში). text-align: center — ცენტრი. margin — გარე მინდვრები. line-height — სტრიქონებს შორის მანძილი.' },
      ],
    },
  })

  await prisma.exercise.upsert({
    where: { lessonId: l21.id },
    update: {},
    create: {
      lessonId: l21.id,
      task: 'HTML ფაილში style ტეგი ჩაამატე (head-ში) და გაასტილე: body — background-color: #0a0a0f, color: white. h1 — color: #6C63FF, text-align: center. p — font-size: 18px, line-height: 1.6.',
      starterCode: '<!DOCTYPE html>\n<html lang="ka">\n<head>\n  <meta charset="UTF-8">\n  <title>CSS</title>\n  <!-- style ტეგი აქ -->\n</head>\n<body>\n  <h1>CSS საინტერესოა!</h1>\n  <p>CSS-ით ვებ-გვერდი ლამაზი ხდება.</p>\n</body>\n</html>',
      solution: '<!DOCTYPE html>\n<html lang="ka">\n<head>\n  <meta charset="UTF-8">\n  <title>CSS</title>\n  <style>\n    body {\n      background-color: #0a0a0f;\n      color: white;\n    }\n    h1 {\n      color: #6C63FF;\n      text-align: center;\n    }\n    p {\n      font-size: 18px;\n      line-height: 1.6;\n    }\n  </style>\n</head>\n<body>\n  <h1>CSS საინტერესოა!</h1>\n  <p>CSS-ით ვებ-გვერდი ლამაზი ხდება.</p>\n</body>\n</html>',
      hints: [
        'style ტეგი head-ში: <style>...</style>',
        'სელექტორი { property: value; } — ეს CSS სტრუქტურაა',
        'color-ი ტექსტის ფერია, background-color კი ფონის',
      ],
    },
  })

  const q21 = await prisma.quiz.create({ data: { lessonId: l21.id, title: 'CSS შესავალი — ტესტი', timeLimit: 10 } })
  const quiz21Qs = [
    { text: 'CSS-ის სრული სახელია:', opts: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Syntax'], c: 0, e: 'CSS — Cascading Style Sheets. "Cascading" ნიშნავს, რომ სტილები ფენებად ვრცელდება.' },
    { text: 'კლასის სელექტორი CSS-ში:', opts: ['#classname', '.classname', '@classname', '*classname'], c: 1, e: '.classname — კლასის სელექტორი. # — ID-სთვის.' },
    { text: 'text-align: center; ეფექტი:', opts: ['ტექსტი ცენტრდება', 'ტექსტი დიდდება', 'ტექსტი ვარდინდება', 'ტექსტი ქრება'], c: 0, e: 'text-align: center — ტექსტს ჰორიზონტალურ ცენტრში ათავსებს.' },
    { text: 'border-radius property:', opts: ['ბლოკის სისქე', 'ბლოკის კიდეების მოხვრა', 'ბლოკის ბრუნვა', 'ბლოკის ხილვადობა'], c: 1, e: 'border-radius — მართკუთხა კიდეებს ამრგვალებს. 50% — წრე გამოდის.' },
    { text: 'color: #FF0000 ნიშნავს:', opts: ['ლურჯი', 'მწვანე', 'წითელი', 'ყვითელი'], c: 2, e: '#FF0000 — HEX კოდი: FF=255 წითელი, 00=0 მწვანე, 00=0 ლურჯი = წითელი.' },
  ]
  for (let i = 0; i < quiz21Qs.length; i++) {
    const qq = quiz21Qs[i]
    await prisma.question.create({ data: { quizId: q21.id, text: qq.text, options: qq.opts, correctAnswer: qq.c, explanation: qq.e, order: i + 1 } })
  }

  // Lesson 2.2 — Flexbox
  const l22 = await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: ch2.id, slug: 'css-flexbox' } },
    update: {},
    create: {
      chapterId: ch2.id,
      title: 'CSS Flexbox',
      slug: 'css-flexbox',
      order: 2,
      duration: 15,
      explanation: 'Flexbox — ელემენტების მოქნილი განლაგება ერთ ხაზში ან სვეტში.',
      codeScript: [
        { code: '.container {\n  display: flex;\n}', explanation: 'display: flex — კონტეინერს Flexbox-ში ვათავსებთ. ბავშვი-ელემენტები ავტომატურად ერთ ხაზში სწორდება.' },
        { code: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}', explanation: 'justify-content — ჰორიზონტალური სწორება. align-items — ვერტიკალური. center ორივე ღერძზე ცენტრში ათავსებს.' },
        { code: '.container {\n  display: flex;\n  justify-content: space-between;\n  gap: 20px;\n  flex-wrap: wrap;\n}', explanation: 'space-between — ელემენტებს შორის თანაბარი სივრცე. gap — ელემენტებს შორის მანძილი. flex-wrap: wrap — ვარ ვა-ხაზზე.' },
        { code: '.container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-height: 100vh;\n  justify-content: center;\n}', explanation: 'flex-direction: column — ვერტიკალური მიმართულება. min-height: 100vh — სრული ეკრანის სიმაღლე. გვერდის ცენტრაცია!' },
      ],
    },
  })

  await prisma.exercise.upsert({
    where: { lessonId: l22.id },
    update: {},
    create: {
      lessonId: l22.id,
      task: 'გაასტილე .navbar კლასი Flexbox-ით: display flex, justify-content space-between, align-items center, padding 16px 32px, background-color #12121A.',
      starterCode: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .navbar {\n    /* Flexbox სტილი */\n  }\n</style>\n</head>\n<body>\n  <div class="navbar">\n    <span>Logo</span>\n    <nav>\n      <a href="#">მთავარი</a>\n      <a href="#">კურსები</a>\n    </nav>\n  </div>\n</body>\n</html>',
      solution: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .navbar {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 16px 32px;\n    background-color: #12121A;\n  }\n</style>\n</head>\n<body>\n  <div class="navbar">\n    <span>Logo</span>\n    <nav>\n      <a href="#">მთავარი</a>\n      <a href="#">კურსები</a>\n    </nav>\n  </div>\n</body>\n</html>',
      hints: ['display: flex; პირველი ნაბიჯია', 'justify-content: space-between; ელემენტებს ბოლოებზე ათავსებს', 'align-items: center; ვერტიკალურ ცენტრში ათავსებს'],
    },
  })

  const q22 = await prisma.quiz.create({ data: { lessonId: l22.id, title: 'CSS Flexbox — ტესტი', timeLimit: 10 } })
  const quiz22Qs = [
    { text: 'Flexbox-ის ჩართვა:', opts: ['display: block', 'display: flex', 'display: grid', 'display: inline'], c: 1, e: 'display: flex — Flexbox კონტეინერის გააქტიურება.' },
    { text: 'justify-content: space-between:', opts: ['ელემენტები ცენტრშია', 'ელემენტებს შორის თანაბარი სივრცე', 'ყველა მარჯვნივ', 'ყველა მარცხნივ'], c: 1, e: 'space-between — პირველი მარცხნივ, ბოლო მარჯვნივ, შუა სივრცე თანაბარი.' },
    { text: 'align-items: center ეფექტი:', opts: ['ჰორიზონტალური ცენტრი', 'ვერტიკალური ცენტრი', 'ორივე ღერძი', 'ტექსტის ცენტრი'], c: 1, e: 'align-items — cross axis-ზე (flex-direction-ის პერპენდიკული) ცენტრი.' },
    { text: 'flex-direction: column:', opts: ['ელემენტები ჰორიზონტალურია', 'ელემენტები ვერტიკალურია', 'ელემენტები ბრუნავს', 'ელემენტები ქრება'], c: 1, e: 'column — ელემენტები ვერტიკალურად სხვდება. row (default) — ჰორიზონტალურად.' },
    { text: 'gap property Flexbox-ში:', opts: ['ბლოკის ზომა', 'ელემენტებს შორის მანძილი', 'border-ის სისქე', 'margin-ის ჩანაცვლება'], c: 1, e: 'gap — flex/grid ელემენტებს შორის სივრცე. margin-ის მოსახერხებელი ალტერნატივა.' },
  ]
  for (let i = 0; i < quiz22Qs.length; i++) {
    const qq = quiz22Qs[i]
    await prisma.question.create({ data: { quizId: q22.id, text: qq.text, options: qq.opts, correctAnswer: qq.c, explanation: qq.e, order: i + 1 } })
  }

  // Lesson 2.3 — Responsive
  const l23 = await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: ch2.id, slug: 'responsive-dizaini' } },
    update: {},
    create: {
      chapterId: ch2.id,
      title: 'Responsive დიზაინი',
      slug: 'responsive-dizaini',
      order: 3,
      duration: 12,
      explanation: 'Responsive — ვებ-გვერდი ყველა ეკრანის ზომაზე კარგად ჩანს.',
      codeScript: [
        { code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">', explanation: 'viewport meta ტეგი — მობილური მოწყობილობებზე სწორი ზომისთვის სავალდებულოა.' },
        { code: '/* Mobile first */\n.container {\n  width: 100%;\n  padding: 16px;\n}\n\n/* Tablet */\n@media (min-width: 768px) {\n  .container {\n    max-width: 768px;\n    margin: 0 auto;\n  }\n}', explanation: 'Media queries (@media) — განსხვავებული სტილი სხვადასხვა ეკრანის ზომისთვის. Mobile first: პირველ სტილი მობილურია.' },
        { code: '.grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 20px;\n}\n\n@media (min-width: 768px) {\n  .grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n@media (min-width: 1024px) {\n  .grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}', explanation: 'CSS Grid — 2D განლაგება. მობილურზე 1 სვეტი, tablet-ზე 2, desktop-ზე 3. repeat(3, 1fr) — 3 თანაბარი სვეტი.' },
        { code: '.img-responsive {\n  width: 100%;\n  max-width: 600px;\n  height: auto;\n}\n\n.text-responsive {\n  font-size: clamp(1rem, 2.5vw, 2rem);\n}', explanation: 'width: 100%, height: auto — სურათი მშობელ კონტეინერს ეგუება. clamp() — font-size ავტომატურად სკალირება ეკრანის მიხედვით.' },
      ],
    },
  })

  await prisma.exercise.upsert({
    where: { lessonId: l23.id },
    update: {},
    create: {
      lessonId: l23.id,
      task: 'შექმენი .cards container Grid-ით: მობილურზე 1 სვეტი (grid-template-columns: 1fr), tablet-ზე (min-width: 640px) 2 სვეტი, desktop-ზე (min-width: 1024px) 3 სვეტი. gap: 24px.',
      starterCode: '<style>\n  .cards {\n    display: grid;\n    gap: 24px;\n    /* Mobile: 1 სვეტი */\n  }\n  /* Tablet */\n  \n  /* Desktop */\n</style>',
      solution: '<style>\n  .cards {\n    display: grid;\n    grid-template-columns: 1fr;\n    gap: 24px;\n  }\n  @media (min-width: 640px) {\n    .cards {\n      grid-template-columns: repeat(2, 1fr);\n    }\n  }\n  @media (min-width: 1024px) {\n    .cards {\n      grid-template-columns: repeat(3, 1fr);\n    }\n  }\n</style>',
      hints: ['grid-template-columns: 1fr — ერთი სვეტი', '@media (min-width: 640px) { } — tablet breakpoint', 'repeat(3, 1fr) — სამი თანაბარი სვეტი'],
    },
  })

  const q23 = await prisma.quiz.create({ data: { lessonId: l23.id, title: 'Responsive — ტესტი', timeLimit: 10 } })
  const quiz23Qs = [
    { text: 'viewport meta ტეგი:', opts: ['SEO-სთვის', 'ენის განსაზღვრისთვის', 'მობილური ჩვენებისთვის', 'charset-ისთვის'], c: 2, e: 'viewport meta — მობილური მოწყობილობებზე სწორი masshtab-ისთვის.' },
    { text: '@media query CSS-ში:', opts: ['ანიმაცია', 'სხვადასხვა ეკრანისთვის სტილი', 'JavaScript კოდი', 'ფონტის იმპორტი'], c: 1, e: '@media — breakpoint-ებისთვის სხვადასხვა სტილი. responsive design-ის საფუძველი.' },
    { text: 'Mobile first მიდგომა:', opts: ['desktop სტილი პირველია', 'mobile სტილი პირველია', 'tablet სტილი პირველია', 'print სტილი პირველია'], c: 1, e: 'Mobile first — პირველ CSS მობილური ეკრანისთვის, შემდეგ @media-ებით ვაფართოვებ.' },
    { text: 'CSS Grid-ის ჩართვა:', opts: ['display: table', 'display: flex', 'display: grid', 'display: block'], c: 2, e: 'display: grid — CSS Grid-ის გააქტიურება. 2D განლაგება.' },
    { text: 'height: auto სურათზე:', opts: ['სიმაღლე ფიქსირებული 100px', 'სიმაღლე პროპორციულად ეგუება სიგანეს', 'სიმაღლე 0 ხდება', 'სიმაღლე ეკრანს ეტოლება'], c: 1, e: 'height: auto — სიმაღლე ავტომატურად პროპორციებს ინარჩუნებს width-ის მიხედვით.' },
  ]
  for (let i = 0; i < quiz23Qs.length; i++) {
    const qq = quiz23Qs[i]
    await prisma.question.create({ data: { quizId: q23.id, text: qq.text, options: qq.opts, correctAnswer: qq.c, explanation: qq.e, order: i + 1 } })
  }

  // Chapter 2 Exam
  const exam2 = await prisma.exam.create({
    data: { chapterId: ch2.id, title: 'CSS სტილიზაცია — თავის გამოცდა', timeLimit: 20, passMark: 70 },
  })
  const exam2Qs = [
    { t: 'CSS — Cascading Style Sheets. "Cascading" ნიშნავს:', opts: ['ანიმაცია', 'სტილების ჩამოდინება (პრიორიტეტი)', 'ფაილის ზომა', 'ბრაუზერის ტიპი'], c: 1, e: 'Cascading — სტილები პრიორიტეტის მიხედვით ვრცელდება.' },
    { t: 'CSS-ის 3 ჩართვის მეთოდი:', opts: ['inline, internal, external', 'head, body, footer', 'class, id, tag', 'color, font, margin'], c: 0, e: 'inline (style=), internal (<style>), external (ცალკე .css ფაილი).' },
    { t: 'ID სელექტორი CSS-ში:', opts: ['.id-name', '#id-name', '@id-name', '&id-name'], c: 1, e: '#id-name — ID სელექტორი. ID გვერდზე ერთხელ გამოიყენება.' },
    { t: 'padding vs margin:', opts: ['ერთნაირია', 'padding შიდა სივრცე, margin — გარე', 'margin შიდა სივრცე, padding — გარე', 'padding border-ია'], c: 1, e: 'padding — ბლოკის შიდა სივრცე (კონტენტი-border). margin — გარე სივრცე (ბლოკებს შორის).' },
    { t: 'border: 2px solid #6C63FF:', opts: ['2px ფართი, მყარი ხაზი, ლურჯი ფერი', '2px მყარი ლურჯი border', 'ბ სწორია', '2 პიქსელი დახრილი'], c: 2, e: 'border shorthand: სისქე | სტილი | ფერი.' },
    { t: 'display: none:', opts: ['ელემენტი ჩანს', 'ელემენტი ქრება და ადგილს არ იკავებს', 'ელემენტი ჩანს, ადგილს ვერ იკავებს', 'ელემენტი ბრუნავს'], c: 1, e: 'display: none — ელემენტი მთლიანად ქრება DOM-ში, ადგილი გათავისუფლდება.' },
    { t: 'position: absolute:', opts: ['დოკუმენტის ნაკადიდან ამოდის, relative მშობელს ეყრდნობა', 'scroll-ს მიჰყვება', 'გვერდის სარდაფია', 'block-level გახდება'], c: 0, e: 'absolute — ნაკადიდან ამოდის, უახლოეს relative/absolute/fixed მშობელს ეყრდნობა.' },
    { t: 'z-index property:', opts: ['ელემენტის სიმაღლე', 'ელემენტების ფენობრიობა (3D)', 'ელემენტის სიგანე', 'ელემენტის ბრუნვა'], c: 1, e: 'z-index — ელემენტების ფენობრიობა. მაღალი რიცხვი — წინ.' },
    { t: 'transition property:', opts: ['ანიმაციის კადრები', 'CSS property ცვლილების ანიმაცია', 'ტრანსფორმაცია', 'გამჭვირვალობა'], c: 1, e: 'transition — CSS პარამეტრის გლუვი ცვლილება (hover effect-ისთვის).' },
    { t: 'opacity: 0.5:', opts: ['50% გამჭვირვალე', '50% ჩანს (50% გამჭვირვალე)', 'ელემენტი ქრება', '50% უფრო პატარა'], c: 1, e: 'opacity: 0.5 — 50% გამჭვირვალობა. 0 = მთლიანად გამჭვირვალე, 1 = ჩვეულებრივი.' },
    { t: 'CSS custom properties (variables):', opts: ['--variable-name: value', '$variable: value', '@variable: value', '#variable: value'], c: 0, e: 'CSS variables: --name: value; და var(--name)-ით გამოყენება.' },
    { t: 'flexbox vs grid:', opts: ['flexbox 2D, grid 1D', 'flexbox 1D, grid 2D', 'ერთნაირია', 'grid 1D, flexbox 0D'], c: 1, e: 'Flexbox — 1D (ერთი ხაზი ან სვეტი). Grid — 2D (სტრიქონი და სვეტი).' },
    { t: 'font-family: sans-serif:', opts: ['სერიფიანი შრიფტი', 'სერიფის გარეშე შრიფტი', 'mono შრიფტი', 'handwriting'], c: 1, e: 'sans-serif — ასოებს "ნეკნები" არ აქვს (Arial, Helvetica). serif — "ნეკნებიანი" (Times).' },
    { t: 'box-shadow: 0 4px 20px rgba(0,0,0,0.3):', opts: ['ელემენტის ჩრდილი', 'ტექსტის ჩრდილი', 'background', 'border'], c: 0, e: 'box-shadow: X Y blur spread color — ბლოკის ჩრდილი.' },
    { t: 'cursor: pointer:', opts: ['მაუსი ქრება', 'მაუსი ხელის სახეს იღებს', 'მაუსი ჩოჩქოლა ხდება', 'scroll ჩნდება'], c: 1, e: 'cursor: pointer — ☝ ხელის კურსორი. button და a ელემენტებს ავტომატურად აქვს.' },
    { t: 'overflow: hidden:', opts: ['კონტენტი ჩანს', 'კონტენტი კვეთს კონტეინერს', 'კონტენტი იმალება კვეთისას', 'scroll ჩნდება'], c: 2, e: 'overflow: hidden — კონტეინერიდან გასული კონტენტი იჭრება.' },
    { t: 'rem vs px:', opts: ['ერთნაირია', 'rem — root-ზე დამოკიდებული, px — ფიქსირებული', 'px — relative, rem — absolute', 'rem მხოლოდ fontisthvisa'], c: 1, e: 'rem — root element (html)-ის font-size-ის ნაწილი. responsive-ისთვის უკეთესი.' },
    { t: 'CSS pseudo-class :hover:', opts: ['ელემენტის ID', 'მაუსის გადაყვანისას სტილი', 'კლასი JavaScript-ში', 'active სტატუსი'], c: 1, e: ':hover — მაუსის ელემენტზე გადაყვანისას CSS სტილი.' },
    { t: '@keyframes CSS-ში:', opts: ['media query', 'import ბრძანება', 'ანიმაციის კადრების განსაზღვრა', 'variable'], c: 2, e: '@keyframes — CSS ანიმაციის სტეპები. animation property-სთან ერთად გამოიყენება.' },
    { t: 'CSS specificity (სპეციფიკობა) პრიორიტეტი:', opts: ['tag < class < id < inline', 'inline < id < class < tag', 'ყველა თანაბარია', 'id < class < inline < tag'], c: 0, e: 'specificity: inline style (1000) > #id (100) > .class (10) > tag (1).' },
  ]
  for (let i = 0; i < exam2Qs.length; i++) {
    const q = exam2Qs[i]
    await prisma.question.create({ data: { examId: exam2.id, text: q.t, options: q.opts, correctAnswer: q.c, explanation: q.e, order: i + 1 } })
  }

  // ==================== CHAPTER 3: პრაქტიკული პროექტი ====================
  const ch3 = await prisma.chapter.upsert({
    where: { courseId_slug: { courseId: htmlCourse.id, slug: 'praktiuli-proeqti' } },
    update: {},
    create: { courseId: htmlCourse.id, title: 'პრაქტიკული პროექტი', slug: 'praktiuli-proeqti', order: 3 },
  })

  const l31 = await prisma.lesson.upsert({
    where: { chapterId_slug: { chapterId: ch3.id, slug: 'landing-page' } },
    update: {},
    create: {
      chapterId: ch3.id,
      title: 'Landing Page-ის შექმნა',
      slug: 'landing-page',
      order: 1,
      duration: 20,
      explanation: 'ახლა ვაშენებ სრულ landing page-ს HTML და CSS-ით.',
      codeScript: [
        { code: '<!DOCTYPE html>\n<html lang="ka">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Codeup — ისწავლე კოდი</title>\n</head>', explanation: 'ახალი landing page. viewport meta ტეგი mobile-ისთვის სავალდებულოა.' },
        { code: '<style>\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  body { font-family: sans-serif; background: #0a0a0f; color: white; }\n  .navbar { display: flex; justify-content: space-between; align-items: center;\n            padding: 16px 32px; border-bottom: 1px solid #2a2a3c; }\n</style>', explanation: '* reset — ყველა ელემენტს margin და padding-ს ვუნარჩუნებთ. navbar Flexbox-ით.' },
        { code: '  .hero { text-align: center; padding: 100px 20px; }\n  .hero h1 { font-size: 3rem; margin-bottom: 20px; }\n  .hero h1 span { color: #6C63FF; }\n  .hero p { color: #888; font-size: 1.2rem; max-width: 600px; margin: 0 auto 40px; }', explanation: 'hero სექცია — მთავარი სათაური, ქვე-სათაური და CTA. span-ით ფერადი სიტყვა.' },
        { code: '  .btn { background: #6C63FF; color: white; padding: 14px 32px;\n          border-radius: 8px; text-decoration: none; font-weight: bold;\n          display: inline-block; transition: background 0.2s; }\n  .btn:hover { background: #4d43f5; }\n</style>\n<body>\n  <nav class="navbar"><span>Codeup.ge</span><a href="#" class="btn">შესვლა</a></nav>\n  <section class="hero">\n    <h1>ისწავლე კოდი <span>ქართულ ენაზე</span></h1>\n    <p>ინტერაქტიული გაკვეთილები, სავარჯიშოები და სერტიფიკატები</p>\n    <a href="#" class="btn">დაიწყე სწავლა →</a>\n  </section>\n</body>', explanation: 'btn სტილი: hover ეფექტი transition-ით. სრული landing page HTML+CSS! გილოცავ — ეს შენი პირველი ვებ-გვერდია!' },
      ],
    },
  })

  await prisma.exercise.upsert({
    where: { lessonId: l31.id },
    update: {},
    create: {
      lessonId: l31.id,
      task: 'დაამთავრე landing page: დაამატე .cards სექცია 3 ბარათით (card კლასი). თითოეულ ბარათში: h3 სათაური და p ტექსტი. .cards — display: flex; gap: 20px. .card — padding: 24px; background: #12121A; border-radius: 12px; flex: 1.',
      starterCode: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { background: #0a0a0f; color: white; font-family: sans-serif; padding: 20px; }\n  .cards { /* 3 სვეტი */ }\n  .card { /* სტილი */ }\n</style>\n</head>\n<body>\n  <section class="cards">\n    <div class="card"><h3>HTML</h3><p>სტრუქტურა</p></div>\n    <div class="card"><h3>CSS</h3><p>სტილიზაცია</p></div>\n    <div class="card"><h3>JS</h3><p>ინტერაქტიულობა</p></div>\n  </section>\n</body>\n</html>',
      solution: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { background: #0a0a0f; color: white; font-family: sans-serif; padding: 20px; }\n  .cards { display: flex; gap: 20px; }\n  .card { padding: 24px; background: #12121A; border-radius: 12px; flex: 1; }\n</style>\n</head>\n<body>\n  <section class="cards">\n    <div class="card"><h3>HTML</h3><p>სტრუქტურა</p></div>\n    <div class="card"><h3>CSS</h3><p>სტილიზაცია</p></div>\n    <div class="card"><h3>JS</h3><p>ინტერაქტიულობა</p></div>\n  </section>\n</body>\n</html>',
      hints: ['.cards-ზე display: flex; gap: 20px;', '.card-ზე padding: 24px; border-radius: 12px;', 'flex: 1 ბარათებს თანაბარ სიგანეს აძლევს'],
    },
  })

  const q31 = await prisma.quiz.create({ data: { lessonId: l31.id, title: 'Landing Page — ტესტი', timeLimit: 10 } })
  const quiz31Qs = [
    { text: '* { margin: 0; padding: 0; } რა ეფექტი აქვს?', opts: ['ყველა ელემენტს ფარავს', 'ყველა ელემენტის margin/padding ნულდება', 'ყველა ელემენტი ქრება', 'CSS reset არარსებობს'], c: 1, e: 'Universal selector (*) reset — browser-ის default სტილების გასუფთავება.' },
    { text: 'box-sizing: border-box:', opts: ['border ელემენტის გარეთ ჩაითვლება', 'border ელემენტის ზომაში ჩაითვლება', 'border ქრება', 'padding ქრება'], c: 1, e: 'border-box — width/height-ში padding და border ჩაითვლება. layout-ი უფრო პროგნოზირებადია.' },
    { text: 'transition: background 0.2s:', opts: ['background 0.2 წამში ანიმაციურად იცვლება', 'background ყოველ 0.2 წამში ციმციმებს', 'background 20%ით იცვლება', 'background-ს transition არ ეხება'], c: 0, e: 'transition — property-ის გლუვი ცვლილება. 0.2s — ანიმაციის ხანგრძლივობა.' },
    { text: 'text-decoration: none; ბმულებზე:', opts: ['ბმული ქრება', 'ხაზი ქვემოდან ქრება', 'ტექსტი bold ხდება', 'ბმული ფერს კარგავს'], c: 1, e: 'a ტეგს default underline (ხაზი) აქვს. text-decoration: none — ამ ხაზს ხსნის.' },
    { text: 'max-width: 600px; ელემენტზე:', opts: ['ელემენტი ყოველთვის 600px', 'ელემენტი 600px-ზე მეტი ვერ გახდება', 'ელემენტი 600px-ზე ნაკლები ვერ გახდება', 'ელემენტი 600px-ში ჩნდება'], c: 1, e: 'max-width — ელემენტი 600px-ზე ვეღარ გაიზრდება, მაგრამ შეიძლება პატარა იყოს.' },
  ]
  for (let i = 0; i < quiz31Qs.length; i++) {
    const qq = quiz31Qs[i]
    await prisma.question.create({ data: { quizId: q31.id, text: qq.text, options: qq.opts, correctAnswer: qq.c, explanation: qq.e, order: i + 1 } })
  }

  // Chapter 3 Exam
  const exam3 = await prisma.exam.create({
    data: { chapterId: ch3.id, title: 'პრაქტიკული პროექტი — გამოცდა', timeLimit: 20, passMark: 70 },
  })
  const exam3Qs = [
    { t: 'viewport meta ტეგი HEAD-ში:', opts: ['SEO-ს', 'charset', 'mobile scaling', 'font'], c: 2, e: 'viewport — mobile-first responsive design-ის საფუძველი.' },
    { t: 'Universal selector:', opts: ['#all', '.all', '*', '@all'], c: 2, e: '* — ყველა HTML ელემენტს ირჩევს.' },
    { t: 'text-align: justify:', opts: ['ცენტრი', 'მარჯვნივ', 'ქვემოთ', 'ორი კიდიდან ტექსტი'], c: 3, e: 'justify — ტექსტი ორივე კიდიდან სწორდება (გაზეთის სტილი).' },
    { t: 'letter-spacing: 2px:', opts: ['სიტყვებს შორის მანძილი', 'ასოებს შორის მანძილი', 'სტრიქონებს შორის მანძილი', 'border'], c: 1, e: 'letter-spacing — ასოებს შორის მანძილი. word-spacing — სიტყვებს შორის.' },
    { t: 'background: linear-gradient(to right, #6C63FF, #FF6B6B):', opts: ['ორი ფერი ვერტიკალურად', 'ორი ფერი ჰორიზონტალურად', 'ოთხი ფერი', 'სურათი'], c: 1, e: 'linear-gradient — ფერის გრადიენტი. to right — მარცხნიდან მარჯვნივ.' },
    { t: 'position: fixed:', opts: ['scroll-ს მიჰყვება', 'ზემოდან ფიქსირებული', 'absolute-ს ჰგავს', 'ეკრანის კუთხეში ფიქსირდება — scroll-ს არ მიჰყვება'], c: 3, e: 'fixed — viewport-ზე ფიქსირდება, scroll-ს არ მიჰყვება. navbar-ებისთვის.' },
    { t: ':nth-child(2n) CSS:', opts: ['პირველი ელემენტი', 'ლუწი ელემენტები', 'კენტი ელემენტები', 'ბოლო ელემენტი'], c: 1, e: ':nth-child(2n) ან :nth-child(even) — ლუწი ელემენტები.' },
    { t: 'CSS animation vs transition:', opts: ['animation ავტომატური, transition — hover', 'transition ავტომატური, animation — hover', 'ერთნაირია', 'animation DOM-ზეა'], c: 0, e: 'transition — state-ის ცვლილებაზე. animation — @keyframes-ით ავტომატური.' },
    { t: 'object-fit: cover სურათზე:', opts: ['სურათი დაჭიმულია', 'სურათი კვეთს, ავსებს, პროპორციებს ინარჩუნებს', 'სურათი ქრება', 'სურათი repeat-ია'], c: 1, e: 'object-fit: cover — სურათი კონტეინერს ავსებს, პროპორციებს ინარჩუნებს, ზედმეტი კვეთილია.' },
    { t: 'CSS :focus pseudo-class:', opts: ['hover ეფექტი', 'active ეფექტი', 'keyboard/click-ით ფოკუსისას', 'visited ბმულისთვის'], c: 2, e: ':focus — ელემენტი keyboard-ით ან click-ით ფოკუსირებულია (input, button).' },
    { t: 'will-change: transform:', opts: ['transform ვერ იცვლება', 'ბრაუზერი GPU-ს ოპტიმიზაციას ამზადებს', 'ელემენტი ბრუნავს', 'transform-ს default მნიშვნელობა'], c: 1, e: 'will-change — ბრაუზერს ეუბნება, რომ ეს ელემენტი შეიცვლება, GPU optimization ხდება.' },
    { t: 'CSS Grid: grid-area:', opts: ['cell-ის ზომა', 'grid-ის სახელი', 'ელემენტს grid template-ში სახელი ენიჭება', 'gap-ის სახელი'], c: 2, e: 'grid-area — ელემენტს ასახელებს, grid-template-areas-ში გამოიყენება.' },
    { t: 'clamp(min, preferred, max):', opts: ['range-ს ამოწმებს', 'property-ს min-preferred-max შორის ადაპტაციას ახდენს', 'ციფრებს ამრგვალებს', 'variable-ს განსაზღვრავს'], c: 1, e: 'clamp() — responsive values-ისთვის: min/max შეზღუდვით, preferred ეტყობა.' },
    { t: 'CSS selector priority:', opts: ['class > tag > id', 'id > class > tag', 'tag > class > id', 'ყველა თანაბარი'], c: 1, e: 'Specificity: id (100) > class (10) > tag (1) > * (0).' },
    { t: 'min-height: 100vh:', opts: ['სიმაღლე ზუსტად 100vh', 'სიმაღლე მინიმუმ viewport სიმაღლე', 'სიმაღლე 100px', 'სიმაღლე max 100vh'], c: 1, e: 'min-height: 100vh — კონტეინერი მინიმუმ viewport სიმაღლეა, კონტენტმა შეიძლება გაზარდოს.' },
  ]
  for (let i = 0; i < exam3Qs.length; i++) {
    const q = exam3Qs[i]
    await prisma.question.create({ data: { examId: exam3.id, text: q.t, options: q.opts, correctAnswer: q.c, explanation: q.e, order: i + 1 } })
  }

  // Final Exam
  const finalExam = await prisma.exam.create({
    data: {
      courseId: htmlCourse.id,
      title: 'HTML & CSS — საბოლოო გამოცდა',
      timeLimit: 40,
      passMark: 80,
    },
  })
  const finalExamQs = [
    { t: 'HTML-ის მიზანი:', opts: ['ვებ-გვერდის სტილი', 'ვებ-გვერდის სტრუქტურა', 'ვებ-გვერდის ინტერაქტიულობა', 'ბაზა'], c: 1, e: 'HTML — სტრუქტურა. CSS — სტილი. JS — ინტერაქტიულობა.' },
    { t: 'სემანტიკური HTML-ის უპირატესობა:', opts: ['სწრაფია', 'SEO და accessibility', 'კომპაქტურია', 'JavaScript'], c: 1, e: 'semantic HTML — header, nav, main, footer. SEO-ს, screen reader-ებისა და accessibility-სთვის.' },
    { t: '<nav> ტეგის დანიშნულება:', opts: ['ფოტოები', 'ნავიგაცია', 'ფუტერი', 'სტატია'], c: 1, e: '<nav> — ნავიგაციის სექცია. სემანტიკური HTML-ის ნაწილი.' },
    { t: 'CSS-ის !important:', opts: ['განსაკუთრებით მნიშვნელოვანი', 'სხვა სტილებს override-ს', 'comment', 'variable'], c: 1, e: '!important — specificity-ს უგულებელყოფს. გამოიყენება უკიდურეს შემთხვევებში.' },
    { t: 'display: inline-block:', opts: ['block-ის მახასიათებლები, ხაზზე ჯდება', 'inline-ის მახასიათებლები', 'block-level only', 'hidden'], c: 0, e: 'inline-block — block-ის width/height/margin შეიძლება, მაგრამ inline-ივით ჯდება.' },
    { t: ':before/:after pseudo-elements:', opts: ['hover ეფექტი', 'კონტენტი content property-ით', 'JavaScript', 'selector'], c: 1, e: '::before/::after — ელემენტის წინ/შემდეგ კონტენტის CSS-ით დამატება.' },
    { t: 'HTML table-ის სტრუქტურა:', opts: ['table > row > cell', 'table > tr > td/th', 'table > tbody > item', 'table > list > td'], c: 1, e: '<table><tr><th>სათაური</th><td>მონაცემი</td></tr></table>' },
    { t: 'CSS-ში rem ერთეული:', opts: ['viewport-ის %', 'root html-ის font-size-ის ნაწილი', 'pixels', 'container-ის %'], c: 1, e: '1rem = html-ის font-size (default 16px). responsive-ისთვის px-ზე სჯობს.' },
    { t: 'flex: 1 კომბინირებული property:', opts: ['flex-grow: 1', 'flex-grow: 1; flex-shrink: 1; flex-basis: 0%', 'flex-direction: 1', 'flex-wrap: 1'], c: 1, e: 'flex: 1 = flex-grow: 1; flex-shrink: 1; flex-basis: 0%. ელემენტი ადაპტირდება.' },
    { t: 'CSS grid: fr ერთეული:', opts: ['font-size-ის (%)', 'free space-ის ნაწილი', 'fixed pixel', 'viewport fraction'], c: 1, e: '1fr — grid-ის დარჩენილი თავისუფალი სივრცის ნაწილი. repeat(3, 1fr) = 3 თანაბარი.' },
    { t: 'HTML data attributes:', opts: ['data-* სათაური', 'custom attribute-ები (data-id, data-name)', 'CSS ცვლადი', 'ფორმის ველი'], c: 1, e: 'data-* — custom data ატრიბუტები. JS-ში dataset-ით ხელმისაწვდომი.' },
    { t: 'CSS @import:', opts: ['JavaScript', 'სხვა CSS ფაილის ჩართვა', 'font', 'variable'], c: 1, e: '@import url("style.css") — სხვა CSS ფაილის ჩართვა (performance-ის გამო <link> სჯობს).' },
    { t: 'HTML rel="stylesheet":', opts: ['ბმული სხვა გვერდზე', 'CSS ფაილის დამკავშირება', 'canonical URL', 'preload'], c: 1, e: '<link rel="stylesheet" href="style.css"> — CSS ფაილის HTML-ში ჩართვა.' },
    { t: 'CSS filter: blur(5px):', opts: ['სურათი ბლანდი ხდება', 'სურათი ბუნდოვანი ხდება', 'სურათი შავ-თეთრი ხდება', 'სურათი ბრუნავს'], c: 1, e: 'filter: blur() — ელემენტი/სურათი ბლო (gaussian blur).' },
    { t: 'visibility: hidden vs display: none:', opts: ['ერთნაირია', 'hidden ინახავს ადგილს, none — არა', 'none ინახავს ადგილს, hidden — არა', 'hidden DOM-ს ხსნის'], c: 1, e: 'visibility: hidden — ელემენტი უხილავია, ადგილი კვლავ უჭირავს. display: none — ყველაფერი ქრება.' },
    { t: 'HTML picture element:', opts: ['<img>-ის ანალოგი', 'responsive სურათებისთვის (srcset)', 'ვიდეო', 'canvas'], c: 1, e: '<picture> — მедиа query-ის მიხედვით სხვადასხვა სურათი. responsive images.' },
    { t: 'CSS inherit:', opts: ['მემკვიდრეობა ბლოკდება', 'მშობლის მნიშვნელობის მემკვიდრეობა', 'default მნიშვნელობა', 'auto'], c: 1, e: 'inherit — property-ი მშობლის მნიშვნელობას "მემკვიდრეობით" იღებს.' },
    { t: 'prefers-color-scheme media query:', opts: ['ეკრანის ზომა', 'Dark/Light mode', 'print mode', 'resolution'], c: 1, e: '@media (prefers-color-scheme: dark) — OS-ის dark mode პარამეტრის ამოცნობა.' },
    { t: 'CSS :root:', opts: ['html ელემენტი', 'body ელემენტი', 'ფიქსირებული ელემენტი', 'root სვეტი'], c: 0, e: ':root = html. CSS variables ჩვეულებრივ :root-ზე განისაზღვრება.' },
    { t: 'HTML aria-label:', opts: ['CSS', 'Accessibility: screen reader-ისთვის label', 'jQuery', 'data attribute'], c: 1, e: 'aria-label — screen reader-ებისთვის ელემენტის ახსნა. accessibility.' },
    { t: 'Web fonts-ის ჩართვა:', opts: ['<font> ტეგით', '@font-face ან Google Fonts <link>', 'font property', 'CSS font-file'], c: 1, e: '@font-face — custom font. Google Fonts: <link> ან @import. system fonts: font-family.' },
    { t: 'CSS specificity კalculation:', opts: ['კლასები+ID+ტეგი', '(inline, ID, class, tag) — 4 სიგნალი', 'რიცხვი', 'პრიორიტეტი'], c: 1, e: 'Specificity: (inline, #id, .class/:pseudo, tag/::pseudo-el) = (1000, 100, 10, 1).' },
    { t: 'placeholder HTML input-ზე:', opts: ['label ტეგი', 'ველის ნაგულისხმევი ტექსტი, ჩაწერისას ქრება', 'required ტექსტი', 'ველის სახელი'], c: 1, e: 'placeholder — input-ის მინიშნება. მომხმარებელი ჩაწერს — placeholder ქრება.' },
    { t: 'CSS scroll-behavior: smooth:', opts: ['scroll-ი ბლოკდება', 'anchor ბმულებზე გლუვი scroll', 'auto scroll', 'JS scroll'], c: 1, e: 'scroll-behavior: smooth — page-ში anchor ბმულებზე (#section) გლუვი გადასვლა.' },
    { t: 'HTML details/summary ტეგები:', opts: ['ცხრილი', 'accordion/collapsible კონტენტი', 'ფორმა', 'section'], c: 1, e: '<details><summary>სათაური</summary>შინაარსი</details> — native accordion.' },
    { t: 'CSS aspect-ratio property:', opts: ['element-ის scale', 'სიგანე/სიმაღლის თანაფარდობა', 'border-ratio', 'pixel ratio'], c: 1, e: 'aspect-ratio: 16/9 — ელემენტი ყოველთვის 16:9 პროპორციაში დარჩება.' },
    { t: 'HTML fieldset/legend:', opts: ['table სტრუქტურა', 'ფორმის ველების დაჯგუფება', 'სია', 'navigation'], c: 1, e: '<fieldset> ფორმის ველებს ჯგუფავს. <legend> — ჯგუფის სათაური.' },
    { t: 'CSS environment() function:', opts: ['ბრაუზერის გარემო', 'safe-area-inset — mobile notch/home bar-ი', 'OS variable', 'CSS variable'], c: 1, e: 'env(safe-area-inset-*) — iPhone notch-ისა და home bar-ის safe area.' },
    { t: 'loading="lazy" img-ზე:', opts: ['სურათი არ ჩაიტვირთება', 'სურათი visible-ის დროს ჩაიტვირთება', 'სურათი სწრაფია', 'სურათი lazy loading-ს'], c: 1, e: 'loading="lazy" — სურათი viewport-ში მოხვედრისას ჩაიტვირთება. performance.' },
    { t: 'CSS @layer:', opts: ['media query', 'CSS სტილების ფენობრიობის კონტროლი', 'font layer', 'z-index ფენა'], c: 1, e: '@layer — CSS cascade layers. სტილების პრიორიტეტის კონტროლი.' },
  ]
  for (let i = 0; i < finalExamQs.length; i++) {
    const q = finalExamQs[i]
    await prisma.question.create({ data: { examId: finalExam.id, text: q.t, options: q.opts, correctAnswer: q.c, explanation: q.e, order: i + 1 } })
  }

  console.log('✅ Seeding complete!')
  console.log('📧 Admin: admin@codeup.ge / admin123')
  console.log('📧 Demo: demo@codeup.ge / demo123')
  console.log('📚 HTML & CSS course created with 3 chapters, 9 lessons, quizzes, and exams!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
