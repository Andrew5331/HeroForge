# HeroForge RPG — Arquitectura de Estado Visual con Redux Toolkit

Taller de Desarrollo Móvil (individual). Mini-juego en **React Native (Expo)** con **TypeScript** y
**Redux Toolkit**, donde cada acción despachada reacciona al mismo tiempo en cuatro zonas
independientes de la pantalla, sin prop drilling entre ellas.

## Video explicativo y demo
▶ https://youtu.be/PhEWXShgloo

## Cómo ejecutarlo
```bash
npm install
npx expo start
```
Escanea el QR con Expo Go (celular y PC en la misma red Wi-Fi). Si algo falla por caché: `npx expo start -c`.

## Estructura
```
App.tsx                       Provider de Redux + las 4 zonas
src/store/
  index.ts                    configureStore, RootState, AppDispatch, hooks tipados
  selectors.ts                estado derivado con createSelector
  slices/
    statsSlice.ts             atributos, puntos, HP, presets
    inventorySlice.ts         catálogo de ítems y equipamiento
    actionLogSlice.ts         últimas 5 acciones (addMatcher / isAnyOf)
src/components/
  HeroAvatarHUD.tsx           Zona A: avatar, clase, barras de vida / maná / peso (solo lee)
  StatsControlPanel.tsx       Zona B: atributos, presets, reseteo
  ArmoryGrid.tsx              Zona C: armería y sobrecarga
  ReduxLiveInspector.tsx      Zona D: arena de combate + consola de Redux en vivo
```

## Estado derivado (no se guarda en el state)
`selectTotalStats`, `selectTotalWeight`, `selectMaxCapacity`, `selectIsOverencumbered`,
`selectCombatPower` y `selectHeroVisualClass` se calculan con `createSelector`, cruzando
`statsSlice` e `inventorySlice`.

## Reglas del juego
- Capacidad de carga = `10 + Fuerza total × 2`.
- Poder de combate = `STR×3 + AGI×2 + INT×3`; sobrecargado = −30 %.
- Clases por atributo dominante (≥ 15): Guerrero Berserker, Tanque Pesado (fuerza + carga ≥ 30 kg),
  Archimago, Asesino Sombrío; si no, Aldeano.

---

# Guion técnico del video (6–7 min)

## Momento 1 | 0:00–1:30 | El problema arquitectónico
*(Pantalla: la app corriendo en el celular o emulador.)*

"Hola, soy [mi nombre] y esta es mi app HeroForge RPG, hecha con React Native, Expo y Redux Toolkit.
Tiene cuatro zonas: arriba el avatar con sus barras, luego el panel de atributos, la armería y abajo
el inspector de Redux con la arena de combate.

Estas cuatro zonas son componentes hermanos y no se pasan ni una prop entre ellos. Si hubiera
intentado hacer esto solo con `useState`, tendría que subir el estado de atributos y el inventario al
componente padre y pasarlo hacia abajo. Eso es prop drilling: componentes intermedios que reciben
datos que no usan solo para reenviarlos. Además tendría el problema del estado redundante: guardar la
fuerza total, el peso y el poder de combate en varios estados locales, y bastaría con olvidar actualizar
uno para que el avatar dijera una cosa y la barra de peso otra.

Redux resuelve esto con un flujo unidireccional. El componente hace `dispatch` de una acción, que es un
objeto con un `type` y un `payload`. Esa acción llega al store, el reducer calcula el nuevo estado y los
componentes que leen ese estado mediante selectores se vuelven a renderizar. UI, dispatch, reducer,
store, selector, re-render. Los datos viajan siempre en una sola dirección, y eso hace que el
comportamiento sea predecible."

## Momento 2 | 1:30–3:30 | Demostración: el efecto dominó
*(Pantalla: la app, con el inspector de Redux visible abajo.)*

"Voy a mostrar cómo una sola acción afecta varias zonas a la vez. Toco el preset Guerrero.

*(Toca "Guerrero".)*

Con un solo dispatch, `stats/applyBuildPreset` con el payload WARRIOR, la fuerza subió a 15, los puntos
disponibles quedaron en 0, el avatar cambió a Guerrero Berserker con aura roja, subió el poder de
combate y el inspector registró la acción con su type y su payload. Ninguna zona habló con otra: todas
leen del mismo store.

Ahora provoco la sobrecarga. Primero uso la Poción de Reseteo para volver a los atributos iniciales y
luego equipo la Armadura Maldita y el Escudo de Titanio.

*(Toca "Reseteo" y equipa los dos ítems.)*

Entre los dos pesan 43 kilos, y mi capacidad es 10 más la fuerza total por 2; con los bonos de los
ítems la fuerza total es 10 y la capacidad queda en 30. Fíjense en la barra de peso: pasa de verde a
amarillo y a rojo según la proporción. Al superar el límite aparece la alerta de SOBRECARGADO en el
avatar y en la armería, y el poder de combate baja un 30%.

*(Aplica otra vez el preset Guerrero con los ítems equipados: la clase pasa a Tanque Pesado.)*

Con más fuerza ya no estoy sobrecargado, y como llevo mucho peso encima la clase cambia a Tanque
Pesado. Todo esto sin tocar ningún componente a mano.

*(Toca "Desequipar todo".)*

Por último, el combate. Ataco al jefe.

*(Toca "Atacar" varias veces.)*

Cada ataque usa mi poder de combate actual y el jefe me devuelve daño. Ese daño es un dispatch de
`takeDamage`: mi barra de vida baja, el avatar pasa a cara de herido con menos de 40 de vida y a
calavera cuando llego a 0. Con el botón Curar despacho `healHero` y vuelvo a estar sano."

## Momento 3 | 3:30–5:30 | Recorrido por el código
*(Pantalla: editor de código.)*

**`src/store/index.ts`**
"Con `configureStore` registro tres reducers: `stats`, `inventory` y `actionLog`. Exporto los tipos
`RootState` y `AppDispatch`, y dos hooks tipados, `useAppDispatch` y `useAppSelector`, que usan todos
los componentes para tener autocompletado y seguridad de tipos."

**`inventorySlice.ts` y `statsSlice.ts`**
"Cada slice se crea con `createSlice`. Miren `toggleEquipItem`: recibe el estado y una
`PayloadAction<string>`, donde el payload es el id del ítem. Si el id ya está en `equippedIds`, lo
quita; si no, hace un `push`. Ese `push` parece una mutación directa, que en Redux normal estaría
prohibida. Pero Redux Toolkit usa Immer por debajo: yo escribo código que parece mutar un borrador del
estado, e Immer registra los cambios y produce un estado nuevo e inmutable.

Otro ejemplo es `applyBuildPreset`: recibe 'WARRIOR', 'MAGE' o 'ROGUE' y con un solo reducer reasigna
fuerza, agilidad e inteligencia y pone los puntos disponibles en cero."

**`actionLogSlice.ts`**
"Este slice no tiene reducers propios. Usa `extraReducers` con `addMatcher` e `isAnyOf` para reaccionar
a las acciones de los otros dos slices. Cada vez que cambia un atributo o se equipa un ítem, agrega una
entrada con el type y el payload y conserva solo las últimas cinco."

**`selectors.ts`**
"La fuerza total, el peso, la capacidad máxima, la sobrecarga, el poder de combate y la clase del héroe
no están guardados en ningún slice. Se calculan con `createSelector`, cruzando `stats` e `inventory`.
Por ejemplo, `selectTotalStats` suma los atributos base más los bonos de los ítems equipados, y
`selectCombatPower` usa ese resultado y la sobrecarga para aplicar el 30% de penalización.

Es estado derivado, y no guardarlo es lo correcto por dos razones. Primero, evita inconsistencias: si
guardara 'sobrecargado' como un booleano en el slice, tendría que actualizarlo en cada reducer que toque
peso o fuerza, y un olvido bastaría para que contradiga la realidad. Segundo, `createSelector` memoiza,
así que solo recalcula cuando cambian sus entradas y los componentes no se re-renderizan de más."

## Momento 4 | 5:30–6:30 | Conclusión
"¿Cuándo uso estado local y cuándo Redux? Un ejemplo está en mi propia app: la vida del jefe en la
arena la guardé con `useState`, porque solo le importa a ese componente. En cambio los atributos y el
inventario viven en Redux, porque los leen el avatar, el panel, la armería y el inspector a la vez.

En un proyecto móvil real usaría estado local para cosas efímeras de una sola pantalla: el texto de un
input, si un modal está abierto, un toggle. Y escalaría a un store global cuando varios componentes
distantes necesitan los mismos datos, cuando hay estado derivado que cruza varias fuentes o cuando
quiero seguir el flujo de acciones para depurar. Redux no sustituye a `useState`; se usa cuando el
estado deja de pertenecer a un solo componente.

Muchas gracias."
