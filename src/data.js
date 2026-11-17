export const categories = [
  { name: 'Dogs', slug: 'dogs', description: 'Care, breeds and everyday life with your canine companion.' },
  { name: 'Cats', slug: 'cats', description: 'Understanding and caring for independent, curious cats.' },
  { name: 'Small Pets', slug: 'small-pets', description: 'Rabbits, guinea pigs, hamsters and other little friends.' },
  { name: 'Birds', slug: 'birds', description: 'Parrots, finches and everything feathered.' },
  { name: 'Fish & Aquatics', slug: 'fish-aquatics', description: 'Tank setup, water quality and healthy fish.' },
  { name: 'Reptiles', slug: 'reptiles', description: 'Habitat, heat and handling for scaly pets.' },
  { name: 'Pet Health', slug: 'pet-health', description: 'Vet-approved advice on prevention and treatment.' },
  { name: 'Nutrition', slug: 'nutrition', description: 'Feeding guides for every species and life stage.' },
  { name: 'Training & Behavior', slug: 'training-behavior', description: 'Positive methods for a happier, well-mannered pet.' },
  { name: 'Adoption', slug: 'adoption', description: 'Finding, welcoming and settling in a new family member.' },
]

export const authors = [
  { name: 'Dr. Maya Collins', role: 'Veterinarian', bio: 'Small-animal vet with 12 years of clinical experience.' },
  { name: 'Tom Ellery', role: 'Certified Dog Trainer', bio: 'Reward-based trainer helping families since 2012.' },
  { name: 'Dr. Priya Nair', role: 'Exotics Veterinarian', bio: 'Specialist in birds, reptiles and small mammals.' },
]
const [maya, tom, priya] = authors.map((a) => a.name)

const mk = (slug, title, excerpt, category, author, date, readTime, body, featured = false) => ({
  slug, title, excerpt, category, author, date, readTime, body, featured,
  image: `https://picsum.photos/seed/${slug}/800/600`,
  avatar: `https://i.pravatar.cc/40?u=${encodeURIComponent(author)}`,
})

export const posts = [
  mk('first-week-with-a-puppy', 'Your first week with a new puppy', 'A calm, practical plan for the first seven days: sleep, potty routine, meals and gentle introductions.', 'dogs', tom, '12 Jan 2026', '6 min read', [
    'The first week with a puppy is a mix of joy and exhaustion. Your new dog has just left its littermates, so expect whining at night and plenty of confusion about where to go to the toilet. Set up a quiet sleeping crate near your bed so your puppy can hear you and feel safe.',
    'Build a simple schedule from day one. Take your puppy outside first thing in the morning, after every meal, after naps, and before bed. Reward immediately with a treat and calm praise whenever they go in the right spot. Most puppies need to go out every one to two hours at first.',
    'Keep introductions slow. Let visitors say hello one at a time and avoid crowded places until vaccinations are complete. Short play sessions followed by long naps are completely normal, since puppies need up to 20 hours of sleep a day.',
    'Finally, book a first vet visit within the first few days. Bring any paperwork from the breeder or shelter and ask about vaccines, parasite prevention and microchipping.',
  ], true),
  mk('why-cats-purr', 'Why do cats purr? Decoding the sound', 'Purring is not always a sign of happiness. Here is what your cat may be telling you.', 'cats', maya, '09 Jan 2026', '4 min read', [
    'Most owners assume a purring cat is a content cat, and often that is true. Cats purr while being stroked, curled up on a lap, or kneading a blanket. But purring is also used for self-soothing when a cat is stressed, in pain or unwell.',
    'The sound comes from rapid twitching of the muscles in the larynx, creating vibrations on both the inhale and exhale. Some researchers believe the low frequency may even help bones and tissues heal.',
    'Look at the whole picture. A relaxed body, slow blinks and soft eyes suggest happiness. Flattened ears, a tucked posture or hiding while purring suggest your cat needs a vet check.',
  ]),
  mk('rabbit-housing-basics', 'Rabbit housing basics: space, safety and enrichment', 'Rabbits need far more room than most cages offer. Learn how to build a setup they will love.', 'small-pets', priya, '06 Jan 2026', '5 min read', [
    'Rabbits are active, social animals that need room to run, jump and stretch out fully. A good rule is a pen of at least two by three metres with daily access to even more space.',
    'Choose solid flooring or soft mats rather than wire, which can injure delicate feet. Provide a hiding box, a litter tray filled with paper-based litter and unlimited fresh hay.',
    'Enrichment prevents boredom and chewing on furniture. Cardboard tunnels, willow balls and digging boxes keep rabbits busy, and rotating toys weekly keeps things interesting.',
  ]),
  mk('keeping-a-parrot-happy', 'Keeping a pet parrot happy and mentally sharp', 'Intelligent birds need stimulation. Foraging, social time and rest are the pillars of a happy parrot.', 'birds', priya, '03 Jan 2026', '5 min read', [
    'Parrots are among the most intelligent pets and can become stressed or destructive without enough mental work. Plan for several hours of out-of-cage time each day.',
    'Foraging toys, shreddable paper and puzzle feeders mimic the natural search for food. Rotate toys regularly so they stay novel.',
    'Good sleep matters too. Aim for ten to twelve hours of darkness and quiet each night, and cover the cage if household noise continues late.',
    'Watch for plucked feathers, loud constant screaming or appetite loss, and speak to an avian vet early if you see them.',
  ]),
  mk('cycling-a-new-aquarium', 'How to cycle a new aquarium safely', 'Before fish move in, your tank needs beneficial bacteria. Here is the fishless cycle step by step.', 'fish-aquatics', maya, '30 Dec 2025', '7 min read', [
    'New tanks are not ready for fish. Fish waste produces ammonia, which is toxic, and it takes weeks for helpful bacteria to grow and convert it into safer compounds.',
    'To cycle without fish, add a source of ammonia, keep the filter and heater running, and test the water every couple of days. You will see ammonia rise, then nitrite, and finally nitrate.',
    'When the tank converts ammonia and nitrite to zero within 24 hours, perform a large water change and add fish gradually, a few at a time.',
  ]),
  mk('bearded-dragon-habitat', 'Setting up the perfect bearded dragon habitat', 'Heat gradients, UVB lighting and the right substrate keep your dragon healthy for years.', 'reptiles', priya, '27 Dec 2025', '6 min read', [
    'Bearded dragons are hardy lizards, but only when their habitat is right. An adult needs an enclosure of at least 120 by 60 centimetres.',
    'Create a temperature gradient with a basking spot around 40 degrees Celsius and a cooler end near 25. Always provide a quality UVB tube replaced every six to twelve months.',
    'Use a safe substrate such as ceramic tile or reptile carpet, add climbing branches and offer a shallow water dish. Check temperatures with a digital thermometer, not stick-on strips.',
  ]),
  mk('annual-vet-checkups', 'Why annual vet check-ups matter', 'Preventive care catches problems early and can save your pet pain and you money.', 'pet-health', maya, '22 Dec 2025', '4 min read', [
    'Pets hide illness well, which is why a yearly exam is one of the best things you can do for them. A vet can spot dental disease, weight changes and heart murmurs long before symptoms appear.',
    'During a check-up your vet will weigh your pet, listen to the heart and lungs, examine teeth and skin, and update vaccines and parasite control.',
    'Senior pets, those over seven, benefit from twice-yearly visits and routine blood tests. Keep a note of any changes in appetite, thirst or energy to share at the appointment.',
  ]),
  mk('reading-pet-food-labels', 'How to read a pet food label', 'Ingredient lists and marketing claims can be confusing. Learn what really matters.', 'nutrition', maya, '18 Dec 2025', '5 min read', [
    'The front of a pet food bag is marketing; the back tells the truth. Start with the nutritional adequacy statement, which says whether the food is complete and balanced for your pet life stage.',
    'Ingredients are listed by weight before cooking, so fresh meat can look high on the list simply because it contains water. Look for a named protein source rather than vague terms.',
    'Compare foods using the guaranteed analysis on a dry-matter basis, and always change foods gradually over seven to ten days to avoid stomach upset.',
  ]),
  mk('stop-leash-pulling', 'How to stop your dog pulling on the leash', 'Walks should be enjoyable. Try these positive techniques to teach loose-leash walking.', 'training-behavior', tom, '14 Dec 2025', '5 min read', [
    'Dogs pull because it works: pulling gets them where they want to go. The solution is to make staying close to you more rewarding than racing ahead.',
    'Start in a quiet place with high-value treats. Reward every step your dog takes beside you, and stop moving the moment the leash goes tight. Resume walking when it slackens.',
    'Be consistent and keep sessions short. A well-fitted front-clip harness can help, but it is a tool, not a replacement for practice.',
  ]),
  mk('adopting-a-shelter-cat', 'Adopting a shelter cat: what to expect', 'Settling a rescue cat takes patience. These tips make the transition smoother for everyone.', 'adoption', maya, '10 Dec 2025', '5 min read', [
    'Shelter cats have often been through upheaval, so give yours time. Prepare a small quiet room with a litter box, water, food, a hiding spot and a scratching post.',
    'Let the cat come out when ready. Sit quietly, offer treats and avoid forcing contact. Many cats take days or even weeks to relax fully.',
    'Once your cat is confident, open up more of the home gradually. Schedule a vet visit and confirm microchip details are registered in your name.',
  ]),
  mk('guinea-pig-diet', 'What guinea pigs should eat every day', 'Vitamin C, hay and fresh vegetables are the foundation of a healthy guinea pig diet.', 'small-pets', priya, '06 Dec 2025', '4 min read', [
    'Guinea pigs cannot make their own vitamin C, so it must come from their diet. Offer a small handful of vitamin-C-rich vegetables such as bell pepper each day.',
    'Unlimited timothy hay should make up most of the diet, keeping teeth worn down and digestion moving. Add a measured portion of plain guinea pig pellets.',
    'Avoid sugary fruit in large amounts, onions and iceberg lettuce. Always provide fresh water in a bottle or heavy bowl.',
  ]),
  mk('senior-dog-care', 'Caring for a senior dog: comfort and health', 'Older dogs need gentler exercise, joint support and more frequent vet visits.', 'dogs', maya, '01 Dec 2025', '6 min read', [
    'Dogs are generally considered seniors from around seven, earlier for giant breeds. You may notice slower walks, stiffness after naps or greying around the muzzle.',
    'Keep them moving with short, regular walks rather than long outings. Orthopedic bedding, non-slip rugs and ramps can make a big difference for sore joints.',
    'Ask your vet about joint supplements, pain relief and diet changes. Regular blood tests and dental checks help catch hidden problems early.',
    'Above all, keep life enjoyable: gentle games, new scents on walks and plenty of affection.',
  ]),
]
