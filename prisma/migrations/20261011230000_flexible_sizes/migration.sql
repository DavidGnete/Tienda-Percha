-- Tallas libres: el enum "Size" pasa a texto para soportar zapatos (38, 39...),
-- lociones (100 ml...) o productos sin opciones. Conserva las tallas existentes.
ALTER TABLE "Product" ALTER COLUMN "Size" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "Size" TYPE TEXT[] USING "Size"::TEXT[];
ALTER TABLE "Product" ALTER COLUMN "Size" SET DEFAULT ARRAY[]::TEXT[];

-- DropEnum
DROP TYPE "Size";
