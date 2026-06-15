import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const LESSONS: { slug: string; codeScript: { code: string; explanation: string }[] }[] = [
  {
    slug: 'raa-html',
    codeScript: [
      {
        code: '<!DOCTYPE html>',
        explanation: 'ეს სტრიქონი გვერდის ყველაზე პირველი ხაზია. ის ბრაუზერს ეუბნება, რომ ეს ფაილი HTML ხუთის, ანუ ყველაზე თანამედროვე HTML-ის სტანდარტით დაწერილია. ამ ინფორმაციის გარეშე ბრაუზერი ვერ გაიგებს, როგორ განათლოს გვერდი, და ყველაფერი არასწორად გამოჩნდება.',
      },
      {
        code: '<!DOCTYPE html>\n<html lang="ka">',
        explanation: 'html ტეგი მთელი გვერდის კონტეინერია. ყველაფერი, რაც ვებ-გვერდზე ჩანს, ამ ტეგის შიგნით უნდა იყოს. lang ატრიბუტი ბრაუზერს და ძიების სისტემებს ეუბნება, რომ ეს გვერდი ქართულ ენაზეა. "ka" ქართული ენის საერთაშორისო კოდია.',
      },
      {
        code: '<!DOCTYPE html>\n<html lang="ka">\n  <head>',
        explanation: 'head სექცია ვებ-გვერდის სამეურნეო ნაწილია — ეკრანზე არ ჩანს, მაგრამ ბრაუზერისთვის ძალიან მნიშვნელოვანია. აქ ვუთითებთ გვერდის სათაურს, ენის კოდირებას, სტილებს და სხვა ტექნიკურ ინფორმაციას, რომელიც გვერდის სწორი მუშაობისთვის საჭიროა.',
      },
      {
        code: '<!DOCTYPE html>\n<html lang="ka">\n  <head>\n    <meta charset="UTF-8">\n    <title>ჩემი პირველი გვერდი</title>\n  </head>',
        explanation: 'charset UTF-8 ნიშნავს, რომ გვერდი Unicode-ის სტანდარტულ კოდირებას იყენებს. სწორედ ამის გამო ქართული ასოები, ემოჯი და ყველა სხვა სიმბოლო სწორად გამოჩნდება. title კი ის ტექსტია, რომელიც ბრაუზერის ჩანართზე ჩანს — გვერდის სათაური.',
      },
      {
        code: '<!DOCTYPE html>\n<html lang="ka">\n  <head>\n    <meta charset="UTF-8">\n    <title>ჩემი პირველი გვერდი</title>\n  </head>\n  <body>\n    <h1>გამარჯობა, სამყარო!</h1>\n    <p>ეს არის ჩემი პირველი ვებ-გვერდი.</p>\n  </body>\n</html>',
        explanation: 'body სექცია ის ნაწილია, რომელიც ეკრანზე ჩანს. h ერთი ყველაზე მნიშვნელოვანი სათაურია — ეს გვერდის მთავარი სათაური. p პარაგრაფია — ჩვეულებრივი ტექსტი. ახლა გვაქვს სრული, მუშა HTML გვერდი! გილოცავ — შენ ახლა ვებ-დეველოპერი ხარ!',
      },
    ],
  },
  {
    slug: 'html-tegebi',
    codeScript: [
      {
        code: '<h1>მთავარი სათაური</h1>\n<h2>ქვე-სათაური</h2>\n<h3>მესამე დონის სათაური</h3>',
        explanation: 'HTML-ში სათაურებს სხვადასხვა მნიშვნელობა აქვს, წიგნის სათაურების მსგავსად. h ერთი ყველაზე მნიშვნელოვანი სათაურია — Google ძიებაც სწორედ ამ სათაურს ყველაზე მეტ ყურადღებას უქცევს. h ორი ქვე-სათაურია, h სამი კიდევ უფრო პატარა. სულ ექვსი დონეა, h ექვსი ყველაზე პატარა.',
      },
      {
        code: '<p>ეს არის <strong>სქელი</strong> და <em>დახრილი</em> ტექსტი.</p>\n<p>ასევე შეგვიძლია <a href="https://google.com">ბმული</a> ჩავდოთ.</p>',
        explanation: 'strong ტეგი ტექსტს სქელ, მუქ შრიფტზე გადაჰყავს — ეს მნიშვნელოვანი ინფორმაციისთვის გამოიყენება. em ტეგი ტექსტს ოდნავ დახრის — ეს ხაზგასმისთვის გამოიყენება. a ტეგი ბმულია — ყველა ლინკი, რომელსაც ვებ-ში ვხედავთ, სწორედ ამ ტეგით კეთდება. href ატრიბუტი ბმულის მისამართია.',
      },
      {
        code: '<img src="surathi.jpg" alt="სურათის აღწერა" width="300">\n<br>\n<hr>',
        explanation: 'img ტეგი სურათს ჩასვამს გვერდში. src ატრიბუტი სურათის ფაილის მისამართია. alt ატრიბუტი ძალიან მნიშვნელოვანია — ეს ტექსტი გამოჩნდება, თუ სურათი ვერ ჩაიტვირთა, და ასევე ახმოვანდება ეკრანის წამკითხველებისთვის, ვინც თვალით ვერ ხედავს. br ახალ სტრიქონზე გადასვლაა, hr კი ჰორიზონტალური ხაზია.',
      },
      {
        code: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n\n<ol>\n  <li>პირველი</li>\n  <li>მეორე</li>\n</ol>',
        explanation: 'ul ნიშნავს unordered list — დაუნომრავი სია, ის bullet point-ებით ჩამოთვლილ სიებს წარმოქმნის. ol ნიშნავს ordered list — დანომრილი სია, სადაც ელემენტები ავტომატურად ინომრება. li კი list item — სიის თითოეული ელემენტია. ყოველ li ტეგს სიაში ერთი ელემენტი უდგენა.',
      },
    ],
  },
  {
    slug: 'html-formebi',
    codeScript: [
      {
        code: '<form action="/submit" method="POST">',
        explanation: 'form ტეგი ყველა შეყვანის ველს ერთ ჯგუფად აერთიანებს. action ატრიბუტი განსაზღვრავს, სად გაიგზავნება შეყვანილი მონაცემები — ჩვეულებრივ სერვერის მისამართი. method POST ნიშნავს, რომ მონაცემები დაფარულად გაიგზავნება და URL-ში ჩანდება — ეს უსაფრთხოა პაროლებისა და პირადი ინფორმაციისთვის.',
      },
      {
        code: '<form action="/submit" method="POST">\n  <label for="saxeli">სახელი:</label>\n  <input type="text" id="saxeli" name="saxeli" placeholder="შენი სახელი">',
        explanation: 'label ტეგი ველის სახელია — ეს ის ტექსტია, რომელიც input-ის გვერდით ჩანს. for ატრიბუტი label-სა და input-ს ურთიერთს უკავშირებს — label-ზე დაჭერისას input-ი ავტომატურად ფოკუსდება. input type text ჩვეულებრივი ტექსტური ველია. placeholder ველის შიგნით ნაჩვენები მაგალითი ტექსტია.',
      },
      {
        code: '<form action="/submit" method="POST">\n  <label for="saxeli">სახელი:</label>\n  <input type="text" id="saxeli" name="saxeli">\n  \n  <label for="email">ელ-ფოსტა:</label>\n  <input type="email" id="email" name="email" required>',
        explanation: 'type email სპეციალური ველია ელ-ფოსტის შეყვანისთვის. ბრაუზერი ავტომატურად ამოწმებს, სწორი ფორმატია თუ არა — გამოჩნდება შეცდომა, თუ at სიმბოლო, ანუ @ გამოგრჩა. required ნიშნავს, რომ ეს ველი სავალდებულოა — ფორმა ვერ გაიგზავნება ამ ველის შევსების გარეშე.',
      },
      {
        code: '<form action="/submit" method="POST">\n  <label for="saxeli">სახელი:</label>\n  <input type="text" id="saxeli" name="saxeli" required>\n  \n  <label for="email">ელ-ფოსტა:</label>\n  <input type="email" id="email" name="email" required>\n  \n  <label for="sheetyvana">შეტყობინება:</label>\n  <textarea id="sheetyvana" name="sheetyvana" rows="4"></textarea>\n  \n  <button type="submit">გაგზავნა</button>\n</form>',
        explanation: 'textarea მრავალ სტრიქოიანი ველია — ტექსტი შეგიძლია გაჭიმო და ბევრი სტრიქო დაწერო. rows ოთხი ვერტიკალურ ზომას განსაზღვრავს — ოთხი სტრიქო ჩანს. button type submit — ეს ის ღილაკია, რომელზეც დაჭერისას ფორმა გაიგზავნება. ახლა გვაქვს სრული, მუშა ფორმა — სახელის, ელ-ფოსტის, შეტყობინებისა და გაგზავნის ღილაკით!',
      },
    ],
  },
  {
    slug: 'css-shesavali',
    codeScript: [
      {
        code: '/* CSS სტრუქტურა */\nselector {\n  property: value;\n}',
        explanation: 'CSS-ის სტრუქტურა ძალიან მარტივია. ჯერ წერ, ვის სტილი გინდა შეცვალო — ეს სელექტორია, ანუ HTML-ის ელემენტის სახელი. შემდეგ ხსნი ფიგურულ ფრჩხილებს. შიგნით წერ, რა გინდა შეცვალო, ამ შემთხვევაში property — თვისება, და რა მნიშვნელობაზე — value. ეს სამი ნაწილი ყოველი CSS წესის საფუძველია.',
      },
      {
        code: 'h1 {\n  color: #6C63FF;\n  font-size: 2rem;\n  font-weight: bold;\n}',
        explanation: 'ამ კოდში ყველა h ერთ სათაურს სამ სტილს ვუნიშნავთ. color ფერია — ჰექსადეციმალური კოდი, ანუ დიეზი და ექვსი სიმბოლო, ნებისმიერ ფერის ზუსტ კოდს წარმოადგენს. font-size ორი rem ნიშნავს ნაგულისხმევ ზომაზე ორჯერ დიდ შრიფტს. font-weight bold კი სქელ, მუქ შრიფტს ნიშნავს.',
      },
      {
        code: 'h1 {\n  color: #6C63FF;\n  font-size: 2rem;\n}\n\n.card {\n  background-color: #1a1a2e;\n  padding: 20px;\n  border-radius: 10px;\n  border: 1px solid #2a2a3c;\n}',
        explanation: 'წერტილი კლასის სელექტორია. card კლასი ნებისმიერ HTML ელემენტს შეგვიძლია მივცეთ class ატრიბუტით. background-color ფონის ფერია. padding ოცი პიქსელი შიდა ბალიშია — ტექსტი და კიდე შორის სივრცე. border-radius ათი პიქსელი კუთხეებს ოდნავ ამრგვალებს — ეს თანამედროვე, მოწესრიგებული ვიზუალია.',
      },
      {
        code: 'h1 {\n  color: #6C63FF;\n}\n\n.card {\n  padding: 20px;\n  border-radius: 10px;\n}\n\n#main-title {\n  text-align: center;\n  margin-bottom: 30px;\n}\n\np {\n  line-height: 1.6;\n  color: #888;\n}',
        explanation: 'დიეზი ID სელექტორია — ID გვერდზე ერთხელ გამოიყენება, ის უნიკალური იდენტიფიკატორია. text-align center ტექსტს ჰორიზონტალური ღერძის ცენტრში ათავსებს. margin-bottom ოცდაათი პიქსელი ქვემოდან გარე სივრცეა. line-height ერთი და ექვსი სტრიქონებს შორის სივრცეა — ეს ტექსტს კომფორტულად წასაკითხ ხდის.',
      },
    ],
  },
  {
    slug: 'css-flexbox',
    codeScript: [
      {
        code: '.container {\n  display: flex;\n}',
        explanation: 'display flex ერთ-ერთი ყველაზე მნიშვნელოვანი CSS property-ია. ამ ერთი სტრიქონით კონტეინერს Flexbox-ის რეჟიმში ვაყენებთ — ყველა შვილი ელემენტი ავტომატურად ერთ ჰორიზონტალურ ხაზში სწორდება. ადრე ბლოკების განლაგება ძალიან რთული იყო, Flexbox კი ამ პრობლემას ელეგანტურად წყვეტს.',
      },
      {
        code: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
        explanation: 'justify-content center ელემენტებს ჰორიზონტალური ღერძის ცენტრში ათავსებს. align-items center კი ვერტიკალური ღერძის ცენტრში ათავსებს. ამ ორი სტრიქონით ნებისმიერი ელემენტი კონტეინერის ზუსტ ცენტრში იდება — ეს ერთ-ერთი ყველაზე ხშირი Flexbox გამოყენებაა და ადრე ძალიან რთული საქმე იყო.',
      },
      {
        code: '.container {\n  display: flex;\n  justify-content: space-between;\n  gap: 20px;\n  flex-wrap: wrap;\n}',
        explanation: 'space-between პირველ ელემენტს მარცხნივ, ბოლოს მარჯვნივ ათავსებს, შუა სივრცე კი ავტომატურად თანაბარდება — ეს ნავიგაციის ზოლებისთვის იდეალურია. gap ოცი პიქსელი ელემენტებს შორის სივრცეა. flex-wrap wrap ნიშნავს: თუ ელემენტები ვეღარ ეტევა ერთ ხაზზე, გადაიტანე ახალ სტრიქონზე.',
      },
      {
        code: '.container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-height: 100vh;\n  justify-content: center;\n}',
        explanation: 'flex-direction column ყველა ელემენტს ვერტიკალურ სვეტში ალაგებს — ნაგულისხმევი ჰორიზონტალური ხაზის ნაცვლად. min-height ასი vh ნიშნავს ეკრანის სრული სიმაღლე. ამ ოთხი სტრიქონით ნებისმიერი ელემენტი ეკრანის ზუსტ ცენტრში ვაყენებთ — ეს login გვერდებისა და hero section-ებისთვის კლასიკური pattern-ია.',
      },
    ],
  },
  {
    slug: 'responsive-dizaini',
    codeScript: [
      {
        code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        explanation: 'viewport meta ტეგი მობილური მოწყობილობებისთვის სავალდებულოა. მის გარეშე სმარტფონი გვერდს desktop ვერსიით გამოაჩენს — ყველაფერი ძალიან პატარა და გაუმასხარა ჩანს. width=device-width ნიშნავს გამოიყენე მოწყობილობის ეკრანის სიგანე. initial-scale ერთი ნიშნავს დაიწყე ნორმალური მასშტაბით.',
      },
      {
        code: '/* Mobile first */\n.container {\n  width: 100%;\n  padding: 16px;\n}\n\n/* Tablet */\n@media (min-width: 768px) {\n  .container {\n    max-width: 768px;\n    margin: 0 auto;\n  }\n}',
        explanation: 'media query-ები სხვადასხვა ეკრანის ზომისთვის სხვადასხვა სტილს ქმნის. Mobile first მიდგომა ნიშნავს: ჯერ მობილური ეკრანისთვის ვწერთ სტილს, შემდეგ @media-ებით ვაფართოვებ დიდ ეკრანებისთვის. min-width შვიდას სამოცდარვა პიქსელი ნიშნავს ამ სიგანიდან ზემოთ ეს სტილი ჩაირთოს — ეს tablet-ის breakpoint-ია.',
      },
      {
        code: '.grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 20px;\n}\n\n@media (min-width: 768px) {\n  .grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n@media (min-width: 1024px) {\n  .grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}',
        explanation: 'CSS Grid ორგანზომილებიანი განლაგებაა — ჰორიზონტალურად და ვერტიკალურადაც. grid-template-columns ერთი fr ნიშნავს ერთი სვეტი. repeat სამი, ერთი fr — სამი თანაბარი სვეტი. ამ კოდით კარტები მობილურზე ერთ სვეტში, tablet-ზე ორ სვეტში, desktop-ზე სამ სვეტში ავტომატურად დაილაგება.',
      },
      {
        code: '.img-responsive {\n  width: 100%;\n  max-width: 600px;\n  height: auto;\n}\n\n.text-responsive {\n  font-size: clamp(1rem, 2.5vw, 2rem);\n}',
        explanation: 'width ასი პროცენტი ნიშნავს სურათი მშობელ კონტეინერს ეტება. max-width ექვსასი პიქსელი კი ზღვარს ადებს — ძალიან დიდ ეკრანზე სურათი ამ ზომაზე მეტი არ გაიზრდება. height auto პროპორციებს ავტომატურად ინარჩუნებს. clamp ფუნქცია შრიფტის ზომას ავტომატურად მასშტაბებს ეკრანის სიგანის მიხედვით.',
      },
    ],
  },
  {
    slug: 'landing-page',
    codeScript: [
      {
        code: '<!DOCTYPE html>\n<html lang="ka">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Codeup — ისწავლე კოდი</title>\n</head>',
        explanation: 'ახლა ვაშენებთ სრულ landing page-ს — ეს ის გვერდია, რომელსაც ვიზიტორი პირველ ხედავს. ყოველ პროფესიონალური ვებ-გვერდი ამ სტრუქტურით იწყება. viewport meta ტეგი მობილური მოწყობილობებისთვის სავალდებულოა — მის გარეშე სმარტფონზე გვერდი არასწორად გამოჩნდება.',
      },
      {
        code: '<style>\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  body { font-family: sans-serif; background: #0a0a0f; color: white; }\n  .navbar { display: flex; justify-content: space-between; align-items: center;\n            padding: 16px 32px; border-bottom: 1px solid #2a2a3c; }\n</style>',
        explanation: 'ვარსკვლავი CSS-ში ყველა ელემენტს ნიშნავს. box-sizing border-box მნიშვნელოვანი reset-ია — padding ბლოკის ზომაში ირიცხება. margin ნულ, padding ნული ნაგულისხმევ სივრცეებს ვანულებთ. navbar Flexbox-ით — ლოგო მარცხნივ, ღილაკი მარჯვნივ.',
      },
      {
        code: '  .hero { text-align: center; padding: 100px 20px; }\n  .hero h1 { font-size: 3rem; margin-bottom: 20px; }\n  .hero h1 span { color: #6C63FF; }\n  .hero p { color: #888; font-size: 1.2rem; max-width: 600px; margin: 0 auto 40px; }',
        explanation: 'hero სექცია გვერდის მთავარი ნაწილია — ეს პირველი, რასაც ვიზიტორი ხედავს. სამი rem დიდი, შთამბეჭდავი სათაურია. span ტეგი სათაურის ერთ სიტყვას ლურჯ ფერში ღებავს — ეს ვიზუალური აქცენტია. max-width ექვსასი პიქსელი ტექსტს ძალიან ფართო ვერ გახდის.',
      },
      {
        code: '  .btn { background: #6C63FF; color: white; padding: 14px 32px;\n          border-radius: 8px; text-decoration: none; font-weight: bold;\n          display: inline-block; transition: background 0.2s; }\n  .btn:hover { background: #4d43f5; }\n</style>\n<body>\n  <nav class="navbar"><span>Codeup.ge</span><a href="#" class="btn">შესვლა</a></nav>\n  <section class="hero">\n    <h1>ისწავლე კოდი <span>ქართულ ენაზე</span></h1>\n    <p>ინტერაქტიული გაკვეთილები, სავარჯიშოები და სერტიფიკატები</p>\n    <a href="#" class="btn">დაიწყე სწავლა →</a>\n  </section>\n</body>',
        explanation: 'btn კლასი ლამაზი ღილაკია. transition background 0.2 წამი ნიშნავს hover-ზე ფერი გლუვად, 0.2 წამში შეიცვლება — ეს professional ეფექტია. text-decoration none ბმულის ქვეხაზს ხსნის. ახლა გვაქვს სრული landing page — navbar-ით, hero section-ით, ღილაკებით. ეს შენი პირველი პროფესიონალური ვებ-გვერდია!',
      },
    ],
  },
]

async function main() {
  console.log('📝 Updating lesson explanations...')
  for (const lesson of LESSONS) {
    const updated = await prisma.lesson.updateMany({
      where: { slug: lesson.slug },
      data: { codeScript: lesson.codeScript as object[] },
    })
    console.log(`✅ ${lesson.slug} — updated ${updated.count} record(s)`)
  }
  console.log('🎉 All explanations updated!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
